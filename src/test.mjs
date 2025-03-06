import * as chai from "chai"; // Correct way to import chai in ESM
import request from "supertest";
import mongoose from "mongoose";
import { server } from "../app.js";
import "dotenv/config";

const { expect } = chai;
let mongoUri =
  "mongodb://127.0.0.1:27017/mongosh?directConnection=true&serverSelectionTimeoutMS=2000";

describe("API Tests", function () {
  let ids = {};

  after(async function () {
    await mongoose.connection.close();
    server.close();
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

  const testCases = [
    {
      description: "should return 500 when MongoDB is disconnected",
      endpoint: "/api/pingdb",
      expectedStatus: 500,
      expectedProps: { message: "❌ MongoDB Not Connected" },

      beforeTest: async () => {
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.dropDatabase();
          await mongoose.connection.close();
          console.log("🛑 MongoDB Disconnected");
        }

        if (process.env.GITHUB_ACTIONS === "true" && mongoServer) {
          await mongoServer.stop();
          console.log("🛑 In-Memory MongoDB Stopped (GitHub Actions)");
        }
      },

      afterTest: async () => {
        if (process.env.GITHUB_ACTIONS === "true") {
          mongoServer = await MongoMemoryServer.create();
          mongoUri = mongoServer.getUri();
          console.log("✅ Reconnecting to MongoDB in Memory (GitHub Actions)");
        } else {
          mongoUri = process.env.MONGO_URI;
          console.log(`✅ Reconnecting to Local MongoDB: ${mongoUri}`);
        }

        await mongoose.connect(mongoUri);
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

  testCases.forEach(({ description, beforeTest, afterTest, ...testCase }) => {
    it(description, async function () {
      if (beforeTest) await beforeTest();
      await testApi({
        ...testCase,
        endpoint:
          typeof testCase.endpoint === "function"
            ? testCase.endpoint()
            : testCase.endpoint,
        payload:
          typeof testCase.payload === "function"
            ? testCase.payload()
            : testCase.payload,
        expectedProps: Object.fromEntries(
          Object.entries(testCase.expectedProps || {}).map(([key, value]) => [
            key,
            typeof value === "function" ? value() : value,
          ]),
        ),
      });
      if (afterTest) await afterTest();
    });
  });
});
