const Booking = require('../models/Booking');

// @desc    Create a new booking (Customer)
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { customerName, phone, vehicleNumber, serviceType, date, time, notes } = req.body;

    if (!customerName || !phone || !vehicleNumber || !serviceType || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required booking fields'
      });
    }

    const booking = await Booking.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      serviceType: serviceType.trim(),
      date,
      time,
      notes: notes ? notes.trim() : '',
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully!',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// @desc    Get all bookings (Admin or filtered)
// @route   GET /api/bookings
// @access  Public or Protected
const getAllBookings = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: searchRegex },
        { phone: searchRegex },
        { vehicleNumber: searchRegex },
        { serviceType: searchRegex }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Public (for customer tracking) or Protected
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Invalid booking ID or server error',
      error: error.message
    });
  }
};

// @desc    Track bookings by Vehicle Number, Phone, or Booking ID
// @route   GET /api/bookings/track/search
// @access  Public
const trackBookings = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a Vehicle Number, Phone, or Booking ID'
      });
    }

    const trimmedQuery = query.trim();
    let filter = {};

    // Check if query is a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(trimmedQuery);

    if (isObjectId) {
      filter = { _id: trimmedQuery };
    } else {
      const regex = new RegExp(`^${trimmedQuery}$`, 'i');
      filter = {
        $or: [
          { vehicleNumber: regex },
          { phone: trimmedQuery }
        ]
      };
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to track bookings',
      error: error.message
    });
  }
};

// @desc    Update booking status (Pending | Approved | Completed | Rejected)
// @route   PUT /api/bookings/:id/status
// @access  Protected (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Completed', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Protected (Admin)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
};

// @desc    Get dashboard metrics & stats
// @route   GET /api/bookings/metrics/summary
// @access  Public / Protected
const getMetricsSummary = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingCount = await Booking.countDocuments({ status: 'Pending' });
    const approvedCount = await Booking.countDocuments({ status: 'Approved' });
    const completedCount = await Booking.countDocuments({ status: 'Completed' });
    const rejectedCount = await Booking.countDocuments({ status: 'Rejected' });

    // Today's date in YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookingsCount = await Booking.countDocuments({ date: todayStr });

    // Group by status
    return res.status(200).json({
      success: true,
      metrics: {
        total: totalBookings,
        pending: pendingCount,
        approved: approvedCount,
        completed: completedCount,
        rejected: rejectedCount,
        today: todayBookingsCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch metrics',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  trackBookings,
  updateBookingStatus,
  deleteBooking,
  getMetricsSummary
};

