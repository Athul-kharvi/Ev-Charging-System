const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const chai = require("chai");
const app = require("./index");

chai.should();

let mongoServer;

before(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

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
    chai.expect(res.status).to.equal(201);
    chai.expect(res.body).to.have.property("_id");
  });

  it("should retrieve all assets", async () => {
    const res = await request(app).get("/api/assets");

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.an("array");
  });
});
