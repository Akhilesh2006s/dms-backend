const VendorCost = require('../models/VendorCost');
const DcOrder = require('../models/DcOrder');
const Product = require('../models/Product');

// @desc    Get vendor cost configuration
// @route   GET /api/vendor-costs/:vendorId
// @access  Private (Admin)
const getVendorCost = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    let vendorCost = await VendorCost.findOne({ vendorId })
      .populate('vendorId', 'name email')
      .populate('products.productId', 'productName')
      .populate('products.enterprises.schools.schoolId', 'school_name school_code zone location');
    
    if (!vendorCost) {
      // Return default structure if not found
      return res.json({
        vendorId,
        products: [],
      });
    }
    
    res.json(vendorCost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update vendor cost configuration
// @route   PUT /api/vendor-costs/:vendorId
// @access  Private (Admin)
const updateVendorCost = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { products } = req.body;
    
    // Validate vendor exists
    const User = require('../models/User');
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'Vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    // Validate products structure
    if (products && Array.isArray(products)) {
      for (const product of products) {
        if (!product.productId) {
          return res.status(400).json({ message: 'Product ID is required for each product' });
        }
        if (!product.productName) {
          return res.status(400).json({ message: 'Product name is required for each product' });
        }
        if (product.defaultCost === undefined || product.defaultCost < 0) {
          return res.status(400).json({ message: 'Default cost must be a non-negative number' });
        }
        
        // Validate product exists
        const productExists = await Product.findById(product.productId);
        if (!productExists) {
          return res.status(400).json({ message: `Product with ID ${product.productId} not found` });
        }
        
        // Validate enterprises
        if (product.enterprises && Array.isArray(product.enterprises)) {
          for (const enterprise of product.enterprises) {
            if (!enterprise.enterpriseName || enterprise.enterpriseName.trim() === '') {
              return res.status(400).json({ message: 'Enterprise name is required' });
            }
            if (enterprise.enterpriseCost === undefined || enterprise.enterpriseCost < 0) {
              return res.status(400).json({ message: 'Enterprise cost must be a non-negative number' });
            }
            
            // Validate schools
            if (enterprise.schools && Array.isArray(enterprise.schools)) {
              for (const school of enterprise.schools) {
                if (!school.schoolId) {
                  return res.status(400).json({ message: 'School ID is required' });
                }
                // Validate school exists
                const schoolExists = await DcOrder.findById(school.schoolId);
                if (!schoolExists) {
                  return res.status(400).json({ message: `School with ID ${school.schoolId} not found` });
                }
              }
            }
          }
        }
      }
    }
    
    // Create or update vendor cost
    const vendorCost = await VendorCost.findOneAndUpdate(
      { vendorId },
      {
        vendorId,
        products: products || [],
      },
      { upsert: true, new: true, runValidators: true }
    )
      .populate('vendorId', 'name email')
      .populate('products.productId', 'productName')
      .populate('products.enterprises.schools.schoolId', 'school_name school_code zone location');
    
    res.json(vendorCost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join('. ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all schools
// @route   GET /api/vendor-costs/schools
// @access  Private (Admin)
const getAllSchools = async (req, res) => {
  try {
    const schools = await DcOrder.find({})
      .select('_id school_name school_code zone location contact_mobile')
      .sort({ school_name: 1 })
      .limit(5000); // Limit to prevent performance issues
    
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get schools by zone
// @route   GET /api/vendor-costs/schools/zone/:zone
// @access  Private (Admin)
const getSchoolsByZone = async (req, res) => {
  try {
    const { zone } = req.params;
    
    const schools = await DcOrder.find({ zone })
      .select('_id school_name school_code zone location contact_mobile')
      .sort({ school_name: 1 })
      .limit(1000); // Limit to prevent performance issues
    
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all zones
// @route   GET /api/vendor-costs/zones
// @access  Private (Admin)
const getZones = async (req, res) => {
  try {
    const zones = await DcOrder.distinct('zone');
    const filteredZones = zones.filter(z => z && z.trim() !== '');
    res.json(filteredZones.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVendorCost,
  updateVendorCost,
  getAllSchools,
  getSchoolsByZone,
  getZones,
};
