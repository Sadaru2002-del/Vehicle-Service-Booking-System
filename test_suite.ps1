Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " FUCHSIUS VEHICLE SERVICE SYSTEM - INTEGRATION TEST SUITE " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"
$feUrl = "http://localhost:5173"
$passCount = 0
$totalTests = 13

function Run-Test($name, $scriptBlock) {
    Write-Host "`n[TEST] $name..." -NoNewline
    try {
        $result = & $scriptBlock
        Write-Host " [PASSED]" -ForegroundColor Green
        return $result
    } catch {
        Write-Host " [FAILED]" -ForegroundColor Red
        Write-Host "       Error: $($_.Exception.Message)" -ForegroundColor DarkRed
        return $null
    }
}

# 1. Frontend Check
$r1 = Run-Test "1. Frontend Service (Vite UI HTTP 200)" {
    $resp = Invoke-WebRequest -Uri $feUrl -UseBasicParsing -TimeoutSec 5
    if ($resp.StatusCode -ne 200) { throw "Status was $($resp.StatusCode)" }
    $global:passCount++
    return $true
}

# 2. Backend Health Check
$r2 = Run-Test "2. Backend API Health Check" {
    $resp = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    if ($resp.status -notmatch "running") { throw "API status unexpected" }
    $global:passCount++
    return $resp
}

# 3. Get Services
$r3 = Run-Test "3. Fetch Public Service Categories" {
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/services" -Method Get
    if (-not $resp.success -or $resp.count -lt 1) { throw "No services returned" }
    Write-Host " ($($resp.count) services found)" -NoNewline -ForegroundColor Gray
    $global:passCount++
    return $resp.services
}

# 4. Customer Creates Booking
$testVehicle = "TEST-WP-" + (Get-Random -Minimum 1000 -Maximum 9999)
$testBookingId = $null
$r4 = Run-Test "4. Customer Submits Booking ($testVehicle)" {
    $body = @{
        customerName = "Automated Test User"
        phone = "0770001122"
        vehicleNumber = $testVehicle
        serviceType = "Oil & Filter Change"
        date = (Get-Date).ToString("yyyy-MM-dd")
        time = "10:30 AM"
        notes = "Automated integration test run."
    } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -Body $body -ContentType "application/json"
    if (-not $resp.success -or -not $resp.booking._id) { throw "Booking creation failed" }
    $global:testBookingId = $resp.booking._id
    $global:passCount++
    return $resp.booking
}

# 5. Customer Tracks Booking
$r5 = Run-Test "5. Customer Tracks Booking by Vehicle Plate" {
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/bookings/track/search?query=$testVehicle" -Method Get
    if (-not $resp.success -or $resp.count -lt 1) { throw "Booking not found in track search" }
    $global:passCount++
    return $resp.bookings[0]
}

# 6. Admin Login
$adminToken = $null
$r6 = Run-Test "6. Admin Secure Login (admin / admin123)" {
    $body = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    if (-not $resp.success -or -not $resp.token) { throw "Login failed" }
    $global:adminToken = $resp.token
    $global:passCount++
    return $resp.token
}

# 7. Admin Verify Token (/me)
$r7 = Run-Test "7. Admin Token Verification (GET /api/auth/me)" {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers $headers
    if (-not $resp.success -or $resp.user.username -ne "admin") { throw "Token validation failed" }
    $global:passCount++
    return $resp.user
}

# 8. Dashboard Metrics
$r8 = Run-Test "8. Admin Dashboard Metrics Summary" {
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/bookings/metrics/summary" -Method Get
    if (-not $resp.success -or $null -eq $resp.metrics.total) { throw "Metrics fetch failed" }
    Write-Host " (Total: $($resp.metrics.total), Pending: $($resp.metrics.pending))" -NoNewline -ForegroundColor Gray
    $global:passCount++
    return $resp.metrics
}

# 9. Admin Updates Status to Approved
$r9 = Run-Test "9. Admin Approves Booking (PUT status='Approved')" {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $body = @{ status = "Approved" } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$testBookingId/status" -Method Put -Body $body -ContentType "application/json" -Headers $headers
    if (-not $resp.success -or $resp.booking.status -ne "Approved") { throw "Status update failed" }
    $global:passCount++
    return $resp.booking
}

# 10. Admin Updates Status to Completed
$r10 = Run-Test "10. Admin Completes Booking (PUT status='Completed')" {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $body = @{ status = "Completed" } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$testBookingId/status" -Method Put -Body $body -ContentType "application/json" -Headers $headers
    if (-not $resp.success -or $resp.booking.status -ne "Completed") { throw "Status update failed" }
    $global:passCount++
    return $resp.booking
}

# 11. Admin Adds Service Category
$testServiceId = $null
$r11 = Run-Test "11. Admin Adds New Service Category" {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $body = @{
        name = "Ceramic Paint Coating (" + (Get-Random -Minimum 100 -Maximum 999) + ")"
        description = "Professional nanotech hydrophobic paint shield."
        priceEstimate = "$200 - $350"
        durationEstimate = "4 hours"
    } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/services" -Method Post -Body $body -ContentType "application/json" -Headers $headers
    if (-not $resp.success -or -not $resp.service._id) { throw "Service addition failed" }
    $global:testServiceId = $resp.service._id
    $global:passCount++
    return $resp.service
}

# 12. Admin Deletes Test Service Category
$r12 = Run-Test "12. Admin Removes Service Category" {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/services/$testServiceId" -Method Delete -Headers $headers
    if (-not $resp.success) { throw "Service deletion failed" }
    $global:passCount++
    return $resp
}

# 13. Admin Deletes Test Booking
$r13 = Run-Test "13. Admin Cleans Up Test Booking" {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $resp = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$testBookingId" -Method Delete -Headers $headers
    if (-not $resp.success) { throw "Booking cleanup failed" }
    $global:passCount++
    return $resp
}

Write-Host "`n----------------------------------------------------------" -ForegroundColor Cyan
Write-Host " TEST RESULTS: $passCount / $totalTests PASSED " -ForegroundColor $(if ($passCount -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan

