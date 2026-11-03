const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  priceEstimate: {
    type: String,
    default: 'Contact for quote'
  },
  durationEstimate: {
    type: String,
    default: '1-2 hours'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);

