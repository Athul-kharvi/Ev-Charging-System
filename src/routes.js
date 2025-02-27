const express = require("express");
const router = express.Router();
const Asset = require("./models");

// Utility function for handling errors
const handleRequest = async (res, callback, successStatus = 200) => {
  try {
    const result = await callback();
    if (!result) return res.status(404).json({ error: "Asset not found" });
    res.status(successStatus).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ➤ Create Asset
router.post("/", (req, res) =>
  handleRequest(
    res,
    async () => {
      const asset = new Asset(req.body);
      return asset;
    },
    201,
  ),
);

// ➤ Read All Assets
router.get("/", (req, res) =>
  handleRequest(res, async () => await Asset.find()),
);

// ➤ Update Asset
router.put("/:id", (req, res) =>
  handleRequest(res, async () =>
    Asset.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  ),
);

// ➤ Delete Asset
router.delete("/:id", (req, res) =>
  handleRequest(res, async () => {
    await Asset.findByIdAndDelete(req.params.id);
    return { message: "Asset deleted successfully" };
  }),
);

module.exports = router;
