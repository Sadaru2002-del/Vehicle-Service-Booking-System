const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  trackBookings,
  updateBookingStatus,
  deleteBooking,
  getMetricsSummary
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Specific paths before :id param
router.get('/metrics/summary', getMetricsSummary);
router.get('/track/search', trackBookings);

// CRUD
router.route('/')
  .post(createBooking)
  .get(getAllBookings);

router.route('/:id')
  .get(getBookingById)
  .delete(protect, deleteBooking);

router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;

