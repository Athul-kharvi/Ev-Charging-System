const request = require("supertest");
const mongoose = require("mongoose");
const chai = require("chai");
const expect = chai.expect;
const { server } = require("../app"); // Import the server, not just app
require("dotenv").config();

describe("API Tests", function () {
  let ids = {};

  after(async function () {
    await mongoose.connection.close();
    server.close(); // Ensure server shuts down after tests
    console.log("MongoDB connection and server closed.");
  });

  async function testApi({
    method = "get",
    endpoint,
    payload = {},
    expectedStatus,
    expectedProps = {},
    storeIdKey = null,
  }) {
    console.log(`Executing test: ${method.toUpperCase()} ${endpoint}`);

    const res =
      method === "get" || method === "delete"
        ? await request(server)[method](endpoint)
        : await request(server)[method](endpoint).send(payload);

    expect(res.status).to.equal(expectedStatus);

    for (const [key, value] of Object.entries(expectedProps)) {
      expect(res.body).to.have.nested.property(key, value);
    }

    if (storeIdKey) {
      ids[storeIdKey] = res.body._id;
    }
  }

  const invalidId = new mongoose.Types.ObjectId(); // Random non-existing ID
  // const originalReadyState = mongoose.connection.readyState;
  const testCases = [
    {
      description: "should return 500 when MongoDB is disconnected",
      endpoint: "/api/pingdb",
      expectedStatus: 500,
      expectedProps: { message: "❌ MongoDB Not Connected" },

      beforeTest: async () => {
        // Ensure MongoDB is disconnected before running the test
        await mongoose.disconnect(); // Properly disconnect from MongoDB
      },

      afterTest: async () => {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }); // Reconnect to MongoDB
      },
    },
    {
      description: "should connect to MongoDB successfully",
      endpoint: "/api/pingdb",
      expectedStatus: 200,
      expectedProps: { message: "✅ MongoDB Connected" },
    },
    {
      description: "should return welcome message on root route",
      endpoint: "/",
      expectedStatus: 200,
      expectedProps: { message: "Welcome to the EV Charging System API!" },
    },
    {
      description: "should create a new Location",
      method: "post",
      endpoint: "/api/assets/locations",
      payload: {
        name: "Test Location",
        address: "123 Test Street",
        status: "Active",
      },
      expectedStatus: 201,
      storeIdKey: "locationId",
    },
    {
      description: "should get all Locations",
      endpoint: "/api/assets/locations",
      expectedStatus: 200,
    },
    {
      description: "should get a single Location",
      endpoint: () => `/api/assets/locations/${ids.locationId}`,
      expectedStatus: 200,
      expectedProps: { "data._id": () => ids.locationId },
    },
    {
      description: "should return 404 for a non-existing Location",
      endpoint: () => `/api/assets/locations/${invalidId}`,
      expectedStatus: 404,
    },
    {
      description: "should update a Location",
      method: "put",
      endpoint: () => `/api/assets/locations/${ids.locationId}`,
      payload: { name: "Updated Location" },
      expectedStatus: 200,
      expectedProps: { "data.name": "Updated Location" },
    },
    {
      description: "should return 404 when updating a non-existing Location",
      method: "put",
      endpoint: () => `/api/assets/locations/${invalidId}`,
      payload: { name: "New Name" },
      expectedStatus: 404,
    },
    {
      description: "should delete a Location",
      method: "delete",
      endpoint: () => `/api/assets/locations/${ids.locationId}`,
      expectedStatus: 200,
    },
    {
      description: "should return 404 when deleting a non-existing Location",
      method: "delete",
      endpoint: () => `/api/assets/locations/${invalidId}`,
      expectedStatus: 404,
    },
    {
      description: "should create a new Charge Station",
      method: "post",
      endpoint: "/api/assets/chargestations",
      payload: () => ({
        name: "Test Station",
        status: "Active",
        location: ids.locationId,
      }),
      expectedStatus: 201,
      storeIdKey: "stationId",
    },
    {
      description: "should create a new Charge Point",
      method: "post",
      endpoint: "/api/assets/chargepoints",
      payload: () => ({
        name: "Test ChargePoint",
        status: "Available",
        chargeStation: ids.stationId,
      }),
      expectedStatus: 201,
      storeIdKey: "chargePointId",
    },
    {
      description: "should create a new Connector",
      method: "post",
      endpoint: "/api/assets/connectors",
      payload: () => ({
        type: "Type 2",
        chargePoint: ids.chargePointId,
        powerOutput: 22,
        status: "Active",
      }),
      expectedStatus: 201,
      storeIdKey: "connectorId",
    },
  ];

  testCases.forEach(
    ({
      description,
      method = "get",
      endpoint,
      payload,
      expectedStatus,
      expectedProps = {},
      storeIdKey,
      beforeTest = async () => {},
      afterTest = async () => {},
    }) => {
      it(description, async function () {
        if (beforeTest) await beforeTest();

        await testApi({
          method,
          endpoint: typeof endpoint === "function" ? endpoint() : endpoint,
          payload: typeof payload === "function" ? payload() : payload,
          expectedStatus,
          expectedProps: Object.fromEntries(
            Object.entries(expectedProps).map(([key, value]) => [
              key,
              typeof value === "function" ? value() : value,
            ]),
          ),
          storeIdKey,
        });
        if (afterTest) await afterTest();
      });
    },
  );
});
