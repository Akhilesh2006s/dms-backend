const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin', 'Super Admin'));

router.get('/', vendorController.list);
router.post('/', vendorController.create);
router.put('/:id/products', vendorController.updateProducts);
router.get('/:id', vendorController.getOne);

module.exports = router;
