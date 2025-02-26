const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("./index.js"); // Ensure correct path to your Express app

let mongoServer;

// Load Chai dynamically for assertion
let chai;
async function loadChai() {
  chai = await import("chai");
  chai.should(); // Initialize Chai "should" assertion style
}

// Setup MongoDB in-memory server before tests
before(async function () {
  this.timeout(30000); // Allow time for MongoDB to start

  await loadChai();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Start MongoDB Memory Server
  try {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: "7.0.0" }, // Ensure compatible MongoDB binary version
    });
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("❌ MongoDB Memory Server failed to start:", error);
    throw error;
  }
});

// Cleanup after tests
after(async function () {
  this.timeout(10000); // Increase timeout for cleanup
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error("❌ Error during teardown:", error);
  }
});

describe("Asset API Tests", () => {
  it("should create a new asset", async () => {
    const assetData = {
      name: "EV Charging Hub",
      type: "Charge Station",
      status: "Active",
      location: "New York",
    };

    const res = await request(app).post("/api/assets").send(assetData);

    // Debugging output for failed cases
    if (res.status !== 201) {
      console.error("Failed Response:", res.body);
    }

    res.status.should.equal(201);
    res.body.should.have.property("_id");
  });

  it("should retrieve all assets", async () => {
    const res = await request(app).get("/api/assets");

    // Debugging output for failed cases
    if (res.status !== 200) {
      console.error("Failed Response:", res.body);
    }

    res.status.should.equal(200);
    res.body.should.be.an("array");
  });
});
