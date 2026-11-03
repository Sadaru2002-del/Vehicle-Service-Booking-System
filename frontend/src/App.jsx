import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TrackBookingPage from './pages/TrackBookingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ServiceCategoriesPage from './pages/ServiceCategoriesPage';

// Simple 404 Component
const NotFoundPage = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-black text-purple-700">404</h1>
    <h2 className="text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
    <p className="text-sm text-slate-500 mt-1 max-w-sm">
      The requested page does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="mt-6 px-6 py-2.5 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800 text-sm transition-colors"
    >
      Return Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900">
          
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500'
              },
              success: {
                iconTheme: {
                  primary: '#a855f7',
                  secondary: '#ffffff'
                }
              }
            }}
          />

          {/* Main Navigation */}
          <Navbar />

          {/* Route Outlet */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/track" element={<TrackBookingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute>
                    <ServiceCategoriesPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
