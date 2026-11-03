const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const Booking = require('../models/Booking');

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

    // 2. Seed Service Categories if empty
    const serviceCount = await ServiceCategory.countDocuments();
    if (serviceCount === 0) {
      const defaultServices = [
        {
          name: 'Oil & Filter Change',
          description: 'High-grade synthetic oil replacement, oil filter change, and complete fluid level check.',
          priceEstimate: '$60 - $90',
          durationEstimate: '45 mins'
        },
        {
          name: 'Full Vehicle Service',
          description: 'Comprehensive 50-point inspection including engine health, brakes, suspension, electrical, and fluids.',
          priceEstimate: '$180 - $250',
          durationEstimate: '3-4 hours'
        },
        {
          name: 'Brake Inspection & Repair',
          description: 'Front and rear brake pad check, rotor resurfacing/replacement, brake fluid bleeding and safety test.',
          priceEstimate: '$90 - $140',
          durationEstimate: '1.5 hours'
        },
        {
          name: 'Wheel Alignment & Balancing',
          description: 'Computerized laser wheel alignment, tire pressure balancing, and rotation to prevent uneven tire wear.',
          priceEstimate: '$50 - $80',
          durationEstimate: '1 hour'
        },
        {
          name: 'Engine Diagnostics & Tune-up',
          description: 'OBD-II computer diagnostics, spark plug inspection, sensor verification, and performance optimization.',
          priceEstimate: '$80 - $130',
          durationEstimate: '1.5 hours'
        },
        {
          name: 'Air Conditioning System Service',
          description: 'A/C refrigerant recharge, leak detection test, cabin filter replacement, and cooling efficiency test.',
          priceEstimate: '$70 - $110',
          durationEstimate: '1 hour'
        }
      ];

      await ServiceCategory.insertMany(defaultServices);
      console.log(`[Seed]: Default service categories seeded (${defaultServices.length} categories)`);
    }

    // 3. Seed sample bookings if empty
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
          date: today,
          time: '04:00 PM',
          notes: 'Steering pulls slightly to the left.',
          status: 'Completed'
        }
      ];

      await Booking.insertMany(sampleBookings);
      console.log(`[Seed]: Sample bookings seeded (${sampleBookings.length} bookings)`);
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};

module.exports = seedData;

