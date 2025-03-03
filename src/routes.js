const express = require("express");
const router = express.Router();
const { Location, ChargeStation, ChargePoint, Connector } = require("./models");

// ✅ Generic function to handle async route errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ✅ Reusable CRUD route generator
const createCrudRoutes = (model, modelName) => {
  const route = modelName.toLowerCase() + "s"; // Convert to plural

  // Get all items
  router.get(
    `/${route}`,
    asyncHandler(async (req, res) => {
      const items = await model.find();
      res.status(200).json(items);
    }),
  );

  // Create a new item
  router.post(
    `/${route}`,
    asyncHandler(async (req, res) => {
      const newItem = await model.create(req.body);
      res.status(201).json(newItem);
    }),
  );

  // Get item by ID
  router.get(
    `/${route}/:id`,
    asyncHandler(async (req, res) => {
      const item = await model.findById(req.params.id);
      if (!item)
        return res.status(404).json({ error: `${modelName} not found` });
      res.status(200).json({ data: item });
    }),
  );

  // Update item by ID
  router.put(
    `/${route}/:id`,
    asyncHandler(async (req, res) => {
      const updatedItem = await model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      if (!updatedItem)
        return res.status(404).json({ error: `${modelName} not found` });
      res.status(200).json({ data: updatedItem });
    }),
  );

  // Delete item by ID
  router.delete(
    `/${route}/:id`,
    asyncHandler(async (req, res) => {
      const deletedItem = await model.findByIdAndDelete(req.params.id);
      if (!deletedItem)
        return res.status(404).json({ error: `${modelName} not found` });
      res.status(200).json({ message: `${modelName} deleted` });
    }),
  );
};

// ✅ Register CRUD routes for each model
createCrudRoutes(Location, "Location");
createCrudRoutes(ChargeStation, "ChargeStation");
createCrudRoutes(ChargePoint, "ChargePoint");
createCrudRoutes(Connector, "Connector");

module.exports = router;
