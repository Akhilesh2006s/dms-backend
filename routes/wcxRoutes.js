const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  listExposures,
  getExposure,
  importFromCsv,
} = require('../controllers/wcxController');

// All WCX routes are protected
router.get('/', authMiddleware, listExposures);
router.get('/:exposure_id', authMiddleware, getExposure);
router.post('/import/csv', authMiddleware, importFromCsv);

module.exports = router;

