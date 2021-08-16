require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const manufacturerData = require('../data/manufacturer.js');

describe('manufacturer routes', () => {

  beforeAll(async () => {
    execSync('npm run setup-db');

    await client.connect();
    
  }, 10000);

  afterAll(done => {
    return client.end(done);
  });

  test('GET /manufacturers returns a list of manufacturers', async() => {
    const expected = manufacturerData.map(maker => maker.name);
    const data = await fakeRequest(app)
      .get('/manufacturers')
      .expect('Content-Type', /json/)
      .expect(200);

    const manufacturerNames = data.body.map(maker => maker.name);

    expect(manufacturerNames).toEqual(expected);
    expect(manufacturerNames.length).toBe(manufacturerNames.length);
    expect(data.body[0].id).toBeGreaterThan(0);
  });
});