const ServiceCategory = require('../models/ServiceCategory');

// @desc    Get all service categories
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const services = await ServiceCategory.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// @desc    Create new service category
// @route   POST /api/services
// @access  Protected (Admin)
const createService = async (req, res) => {
  try {
    const { name, description, priceEstimate, durationEstimate } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Service name and description are required'
      });
    }

    const existingService = await ServiceCategory.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'A service category with this name already exists'
      });
    }

    const service = await ServiceCategory.create({
      name: name.trim(),
      description: description.trim(),
      priceEstimate: priceEstimate ? priceEstimate.trim() : 'Contact for quote',
      durationEstimate: durationEstimate ? durationEstimate.trim() : '1-2 hours'
    });

    return res.status(201).json({
      success: true,
      message: 'Service category created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service category',
      error: error.message
    });
  }
};

// @desc    Update service category
// @route   PUT /api/services/:id
// @access  Protected (Admin)
const updateService = async (req, res) => {
  try {
    const { name, description, priceEstimate, durationEstimate } = req.body;
    const service = await ServiceCategory.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    if (name) service.name = name.trim();
    if (description) service.description = description.trim();
    if (priceEstimate) service.priceEstimate = priceEstimate.trim();
    if (durationEstimate) service.durationEstimate = durationEstimate.trim();

    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service category updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service category',
      error: error.message
    });
  }
};

// @desc    Delete service category
// @route   DELETE /api/services/:id
// @access  Protected (Admin)
const deleteService = async (req, res) => {
  try {
    const service = await ServiceCategory.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    await ServiceCategory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Service category removed successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service category',
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService
};

