const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const { expect } = require('chai');
const app = require('./index');

let mongoServer;

before(async () => {
    // 🚀 Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // ✅ Start in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // ✅ Connect to in-memory DB
    await mongoose.connect(mongoUri);
});

after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('Asset API Tests', () => {
    it('should create a new asset', async () => {
        const res = await request(app)
            .post('/api/assets')
            .send({
                name: "EV Charging Hub",
                type: "Charge Station",
                status: "Active",
                location: "New York"
            });
    
        console.log("Response Status:", res.status);
        console.log("Response Body:", res.body); // ✅ Debug output
    
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
    });
    
    

    it('should retrieve all assets', async () => {
        const res = await request(app).get('/api/assets');

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });
});
