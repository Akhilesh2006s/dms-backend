const DmsVariant = require('../models/DmsVariant');

// @route GET /api/dms/variants
exports.listVariants = async (req, res) => {
  try {
    const { model } = req.query;
    const filter = {};
    if (model) filter.model = model;
    const items = await DmsVariant.find(filter).sort({ model: 1, variant_id: 1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('listVariants error:', err);
    res.status(500).json({ message: 'Failed to load variants', error: err.message });
  }
};

// @route POST /api/dms/variants
exports.createVariant = async (req, res) => {
  try {
    const payload = {
      variant_id: req.body.variant_id,
      model: req.body.model,
      variant: req.body.variant,
      fuel_type: req.body.fuel_type,
      transmission: req.body.transmission,
      oem: req.body.oem,
    };

    if (!payload.variant_id || !payload.model || !payload.variant) {
      return res
        .status(400)
        .json({ message: 'variant_id, model and variant are required' });
    }

    const existing = await DmsVariant.findOne({ variant_id: payload.variant_id });
    if (existing) {
      return res.status(409).json({ message: 'Variant with this ID already exists' });
    }

    const doc = await DmsVariant.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    console.error('createVariant error:', err);
    res.status(500).json({ message: 'Failed to create variant', error: err.message });
  }
};

