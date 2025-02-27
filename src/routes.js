const express = require("express");
const router = express.Router();
const { Location, ChargeStation, ChargePoint, Connector } = require("./models");

// Utility function for handling errors
const handleRequest = async (res, callback, successStatus = 200) => {
  try {
    const result = await callback();
    if (!result) return res.status(404).json({ error: "Not found" });
    res.status(successStatus).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== LOCATION ROUTES ====================
// ➤ Create Location
router.post("/locations", (req, res) =>
  handleRequest(res, async () => new Location(req.body).save(), 201)
);

// ➤ Read All Locations
router.get("/locations", (req, res) =>
  handleRequest(res, async () => Location.find())
);

// ➤ Read Location by ID
router.get("/locations/:id", (req, res) =>
  handleRequest(res, async () => Location.findById(req.params.id))
);

// ➤ Update Location
router.put("/locations/:id", (req, res) =>
  handleRequest(res, async () =>
    Location.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);

// ➤ Delete Location
router.delete("/locations/:id", (req, res) =>
  handleRequest(res, async () => {
    await Location.findByIdAndDelete(req.params.id);
    return { message: "Location deleted successfully" };
  })
);

// ==================== CHARGE STATION ROUTES ====================
// ➤ Create Charge Station
router.post("/stations", (req, res) =>
  handleRequest(res, async () => new ChargeStation(req.body).save(), 201)
);

// ➤ Read All Charge Stations
router.get("/stations", (req, res) =>
  handleRequest(res, async () => ChargeStation.find().populate("location"))
);

// ➤ Read Charge Station by ID
router.get("/stations/:id", (req, res) =>
  handleRequest(res, async () => ChargeStation.findById(req.params.id).populate("location"))
);

// ➤ Update Charge Station
router.put("/stations/:id", (req, res) =>
  handleRequest(res, async () =>
    ChargeStation.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);

// ➤ Delete Charge Station
router.delete("/stations/:id", (req, res) =>
  handleRequest(res, async () => {
    await ChargeStation.findByIdAndDelete(req.params.id);
    return { message: "Charge Station deleted successfully" };
  })
);

// ==================== CHARGE POINT ROUTES ====================
// ➤ Create Charge Point
router.post("/chargepoints", (req, res) =>
  handleRequest(res, async () => new ChargePoint(req.body).save(), 201)
);

// ➤ Read All Charge Points
router.get("/chargepoints", (req, res) =>
  handleRequest(res, async () => ChargePoint.find().populate("chargeStation"))
);

// ➤ Read Charge Point by ID
router.get("/chargepoints/:id", (req, res) =>
  handleRequest(res, async () => ChargePoint.findById(req.params.id).populate("chargeStation"))
);

// ➤ Update Charge Point
router.put("/chargepoints/:id", (req, res) =>
  handleRequest(res, async () =>
    ChargePoint.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);

// ➤ Delete Charge Point
router.delete("/chargepoints/:id", (req, res) =>
  handleRequest(res, async () => {
    await ChargePoint.findByIdAndDelete(req.params.id);
    return { message: "Charge Point deleted successfully" };
  })
);

// ==================== CONNECTOR ROUTES ====================
// ➤ Create Connector
router.post("/connectors", (req, res) =>
  handleRequest(res, async () => new Connector(req.body).save(), 201)
);

// ➤ Read All Connectors
router.get("/connectors", (req, res) =>
  handleRequest(res, async () => Connector.find().populate("chargePoint"))
);

// ➤ Read Connector by ID
router.get("/connectors/:id", (req, res) =>
  handleRequest(res, async () => Connector.findById(req.params.id).populate("chargePoint"))
);

// ➤ Update Connector
router.put("/connectors/:id", (req, res) =>
  handleRequest(res, async () =>
    Connector.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);

// ➤ Delete Connector
router.delete("/connectors/:id", (req, res) =>
  handleRequest(res, async () => {
    await Connector.findByIdAndDelete(req.params.id);
    return { message: "Connector deleted successfully" };
  })
);

module.exports = router;
