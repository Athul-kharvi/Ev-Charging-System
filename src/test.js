const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("./index.js"); // Ensure correct path to your Express app

let chai;

async function loadChai() {
  chai = await import("chai");
  chai.should(); // Initialize Chai "should" assertion style
}

let mongoServer;

// Before all tests, start in-memory MongoDB and connect
before(async function () {
  this.timeout(10000); // Increase timeout for MongoDB startup if needed

  await loadChai(); // Load Chai dynamically

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// After all tests, disconnect and stop in-memory database
after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Asset API Tests", () => {
  it("should create a new asset", async () => {
    const res = await request(app).post("/api/assets").send({
      name: "EV Charging Hub",
      type: "Charge Station",
      status: "Active",
      location: "New York",
    });

    console.log("Response Status:", res.status);
    console.log("Response Body:", res.body);

    res.status.should.equal(201);
    res.body.should.have.property("_id");
  });

  it("should retrieve all assets", async () => {
    const res = await request(app).get("/api/assets");

    res.status.should.equal(200);
    res.body.should.be.an("array");
  });
});
