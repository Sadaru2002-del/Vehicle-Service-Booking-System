const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const Booking = require('../models/Booking');

const defaultServices = [
  {
    name: 'Oil & Filter Change',
    description: 'High-grade synthetic engine oil replacement, genuine oil filter change, and complete fluid level inspection.',
    priceEstimate: 'LKR 14,500',
    durationEstimate: '45 mins'
  },
  {
    name: 'Full Vehicle Service',
    description: 'Comprehensive 50-point inspection including engine health, brakes, suspension, electrical system, and all essential fluids.',
    priceEstimate: 'LKR 45,000',
    durationEstimate: '3-4 hours'
  },
  {
    name: 'Brake Inspection & Repair',
    description: 'Front and rear brake pad check, rotor resurfacing/replacement, brake fluid flush, and ABS safety test.',
    priceEstimate: 'LKR 12,000',
    durationEstimate: '1.5 hours'
  },
  {
    name: 'Wheel Alignment & Balancing',
    description: 'Computerized 3D laser wheel alignment, tire pressure balancing, and rotation to prevent uneven tire wear.',
    priceEstimate: 'LKR 5,500',
    durationEstimate: '1 hour'
  },
  {
    name: 'Engine Diagnostics & Tune-up',
    description: 'OBD-II electronic computer diagnostic scan, spark plug test, fuel system optimization, and engine tuning.',
    priceEstimate: 'LKR 11,000',
    durationEstimate: '1.5 hours'
  },
  {
    name: 'Air Conditioning System Service',
    description: 'A/C refrigerant (gas) refill, leak detection test, cabin pollen filter cleaning/replacement, and cooling performance check.',
    priceEstimate: 'LKR 16,500',
    durationEstimate: '1 hour'
  }
];

const seedData = async () => {
  try {
    // 1. Seed Admin User
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (!existingAdmin) {
      await User.create({
        username: adminUsername,
        password: adminPassword
      });
      console.log(`[Seed]: Default Admin created (Username: ${adminUsername}, Password: ${adminPassword})`);
    }

    // 2. Ensure Service Categories exist and have LKR prices
    const serviceCount = await ServiceCategory.countDocuments();
    if (serviceCount === 0) {
      await ServiceCategory.insertMany(defaultServices);
      console.log(`[Seed]: Default service categories seeded with LKR prices (${defaultServices.length} categories)`);
    } else {
      // Update any existing categories to have LKR prices if they had old prices
      for (const service of defaultServices) {
        await ServiceCategory.findOneAndUpdate(
          { name: service.name },
          { 
            priceEstimate: service.priceEstimate,
            durationEstimate: service.durationEstimate,
            description: service.description
          },
          { upsert: false }
        );
      }
      console.log(`[Seed]: Service categories verified & synced with LKR pricing`);
    }

    // 3. Update existing bookings with missing or non-LKR prices
    const servicePriceMap = {
      'Oil & Filter Change': 'LKR 14,500',
      'Full Vehicle Service': 'LKR 45,000',
      'Brake Inspection & Repair': 'LKR 12,000',
      'Wheel Alignment & Balancing': 'LKR 5,500',
      'Engine Diagnostics & Tune-up': 'LKR 11,000',
      'Air Conditioning System Service': 'LKR 16,500'
    };

    const bookingsWithoutLkr = await Booking.find({
      $or: [
        { priceEstimate: { $exists: false } },
        { priceEstimate: '' },
        { priceEstimate: { $regex: '^\\$' } }
      ]
    });

    for (const b of bookingsWithoutLkr) {
      const lkrPrice = servicePriceMap[b.serviceType] || 'LKR 12,000';
      await Booking.findByIdAndUpdate(b._id, { priceEstimate: lkrPrice });
    }

    // 4. Seed sample bookings if empty
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      const sampleBookings = [
        {
          customerName: 'Kamal Perera',
          phone: '0771234567',
          vehicleNumber: 'WP CAB-4521',
          serviceType: 'Oil & Filter Change',
          priceEstimate: 'LKR 14,500',
          date: today,
          time: '09:00 AM',
          notes: 'Prefer 5W-30 synthetic oil please.',
          status: 'Approved'
        },
        {
          customerName: 'Nimal Silva',
          phone: '0719876543',
          vehicleNumber: 'CP CAA-8812',
          serviceType: 'Full Vehicle Service',
          priceEstimate: 'LKR 45,000',
          date: today,
          time: '11:00 AM',
          notes: 'Check noise near front left wheel.',
          status: 'Pending'
        },
        {
          customerName: 'Kasun Jayawardena',
          phone: '0765554321',
          vehicleNumber: 'SP KU-1980',
          serviceType: 'Brake Inspection & Repair',
          priceEstimate: 'LKR 12,000',
          date: tomorrow,
          time: '02:00 PM',
          notes: 'Brake squeaking sound during high speed braking.',
          status: 'Pending'
        },
        {
          customerName: 'Dilshan Fernando',
          phone: '0783332211',
          vehicleNumber: 'WP CAR-9023',
          serviceType: 'Wheel Alignment & Balancing',
          priceEstimate: 'LKR 5,500',
          date: today,
          time: '04:00 PM',
          notes: 'Steering pulls slightly to the left.',
          status: 'Completed'
        }
      ];

      await Booking.insertMany(sampleBookings);
      console.log(`[Seed]: Sample bookings seeded with LKR prices (${sampleBookings.length} bookings)`);
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};

module.exports = seedData;
