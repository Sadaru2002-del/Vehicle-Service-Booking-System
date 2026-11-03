const express = require('express');
const router = express.Router();
const {
  getAllServices,
  createService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllServices)
  .post(protect, createService);

router.delete('/:id', protect, deleteService);

module.exports = router;

