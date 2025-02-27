const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../app.js");

let mongoServer;
let chai;
async function loadChai() {
  chai = await import("chai");
  chai.should();
}

before(async function () {
  this.timeout(60000);
  await loadChai();
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.disconnect();
  await mongoose.connect(uri);
});

after(async function () {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Asset api Tests", () => {
  let locationId, stationId, chargePointId, connectorId;

  it("should create a new location", async () => {
    const res = await request(app).post("/api/assets/locations").send({ 
      name: "New York", 
      address: "123 Main St, NY" // ✅ Added required field
    });
  
    res.status.should.equal(201);
    res.body.should.have.property("_id");
    locationId = res.body._id;
  });
  
  it("should create a new charge station", async () => {
    const res = await request(app).post("/api/assets/stations").send({ 
      name: "EV Hub", 
      location: locationId,
      status: "active" // ✅ Added required field
    });
  
    res.status.should.equal(201);
    res.body.should.have.property("_id");
    stationId = res.body._id;
  });
  
  it("should create a new charge point", async () => {
    const res = await request(app).post("/api/assets/chargepoints").send({ 
      name: "CP-001",  // ✅ Fixed incorrect field name
      chargeStation: stationId,
      status: "available" // ✅ Added required field
    });
  
    res.status.should.equal(201);
    res.body.should.have.property("_id");
    chargePointId = res.body._id;
  });
  
  it("should create a new connector", async () => {
    const res = await request(app).post("/api/assets/connectors").send({ 
      type: "Type 2", 
      chargePoint: chargePointId, 
      powerOutput: 22, // ✅ Added required field
      status: "operational" // ✅ Added required field
    });
  
    res.status.should.equal(201);
    res.body.should.have.property("_id");
    connectorId = res.body._id;
  });
  

  it("should retrieve all locations", async () => {
    const res = await request(app).get("/api/assets/locations");
    res.status.should.equal(200);
    res.body.should.be.an("array");
  });

  it("should retrieve all charge stations", async () => {
    const res = await request(app).get("/api/assets/stations");
    res.status.should.equal(200);
    res.body.should.be.an("array");
  });

  it("should retrieve all charge points", async () => {
    const res = await request(app).get("/api/assets/chargepoints");
    res.status.should.equal(200);
    res.body.should.be.an("array");
  });

  it("should retrieve all connectors", async () => {
    const res = await request(app).get("/api/assets/connectors");
    res.status.should.equal(200);
    res.body.should.be.an("array");
  });
});