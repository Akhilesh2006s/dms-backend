const express = require('express');
const router = express.Router();
const vendorCostController = require('../controllers/vendorCostController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin', 'Super Admin'));

router.get('/zones', vendorCostController.getZones);
router.get('/schools', vendorCostController.getAllSchools);
router.get('/schools/zone/:zone', vendorCostController.getSchoolsByZone);
router.get('/:vendorId', vendorCostController.getVendorCost);
router.put('/:vendorId', vendorCostController.updateVendorCost);

module.exports = router;
