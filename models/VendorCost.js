const mongoose = require('mongoose');

const enterpriseSchoolSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DcOrder',
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  schoolCode: {
    type: String,
    default: '',
  },
}, { _id: true });

const enterpriseSchema = new mongoose.Schema({
  enterpriseName: {
    type: String,
    required: true,
  },
  enterpriseCost: {
    type: Number,
    required: true,
    min: 0,
  },
  schools: [enterpriseSchoolSchema],
}, { _id: true });

const productCostSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  defaultCost: {
    type: Number,
    required: true,
    min: 0,
  },
  enterprises: [enterpriseSchema],
}, { _id: true });

const vendorCostSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  products: [productCostSchema],
}, {
  timestamps: true,
});

// Ensure one cost record per vendor
vendorCostSchema.index({ vendorId: 1 }, { unique: true });

module.exports = mongoose.model('VendorCost', vendorCostSchema);
