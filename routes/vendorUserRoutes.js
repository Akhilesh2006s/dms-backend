const express = require('express');
const router = express.Router();
const {
  getVendorDashboard,
  getVendorStocks,
  getVendorDCs,
  ensureVendor,
} = require('../controllers/vendorUserController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(ensureVendor);

router.get('/dashboard', getVendorDashboard);
router.get('/stocks', getVendorStocks);
router.get('/dcs', getVendorDCs);

module.exports = router;
