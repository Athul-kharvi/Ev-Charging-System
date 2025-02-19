const express = require('express');
const router = express.Router();
const Asset = require('./models');

// Create Asset
router.post('/', async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.status(201).send(asset);
});

// Read Assets
router.get('/', async (req, res) => {
  const assets = await Asset.find();
  res.send(assets);
});

// Update Asset
router.put('/:id', async (req, res) => {
  const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(asset);
});

// Delete Asset
router.delete('/:id', async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id);
  res.send({ message: 'Asset deleted' });
});

module.exports = router;
