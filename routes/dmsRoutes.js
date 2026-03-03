const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  listBranches,
  listCustomers,
  listLeads,
  listVehicles,
  listFacilities,
  listVinFinancing,
  createBranch,
  createCustomer,
  createLead,
  createVehicle,
  createFacility,
  createVinFinance,
  importCustomers,
  importLeads,
  importVehicles,
  importBranches,
  importVariants,
} = require('../controllers/dmsController');
const {
  listVariants,
  createVariant,
} = require('../controllers/dmsVariantController');

// List APIs
router.get('/branches', authMiddleware, listBranches);
router.get('/variants', authMiddleware, listVariants);
router.get('/customers', authMiddleware, listCustomers);
router.get('/leads', authMiddleware, listLeads);
router.get('/vehicles', authMiddleware, listVehicles);
router.get('/facilities', authMiddleware, listFacilities);
router.get('/vin-financing', authMiddleware, listVinFinancing);

// Create APIs
router.post('/branches', authMiddleware, createBranch);
router.post('/variants', authMiddleware, createVariant);
router.post('/customers', authMiddleware, createCustomer);
router.post('/leads', authMiddleware, createLead);
router.post('/vehicles', authMiddleware, createVehicle);
router.post('/facilities', authMiddleware, createFacility);
router.post('/vin-financing', authMiddleware, createVinFinance);

// Import CSV (ideally Admin / Super Admin, but reuse authMiddleware for now)
router.post('/import/customers', authMiddleware, importCustomers);
router.post('/import/leads', authMiddleware, importLeads);
router.post('/import/vehicles', authMiddleware, importVehicles);
router.post('/import/branches', authMiddleware, importBranches);
router.post('/import/variants', authMiddleware, importVariants);

module.exports = router;

