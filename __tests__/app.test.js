require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const discsData = require('../data/discs.js');

describe('disc routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns discs', async() => {

      const expectation = discsData.map(disc => disc.disc);
      const expectedShape = {
        id: 1,
        disc: 'Aviar',
        speed: 2,
        type: 'Putt/Approach',
        manufacturer: 'Innova',
        stable: true,
        plastics: 'star, gstar, champion, xt, r-pro, glow, dx'
      };

      // [
      //   {
      //     id: 2,
      //     disc: 'Roc',
      //     speed: 4,
      //     type: 'Midrange',
      //     brand: 'innova',
      //     stable: true,
      //     plastics: 'star, pro, glow, dx'
      //   },
      //   {
      //     id: 3,
      //     disc: 'Essence',
      //     speed: 8,
      //     type: 'Fairway Driver',
      //     brand: 'discmania',
      //     stable: false,
      //     plastics: 'neo, geo'
      //   },
      //   {
      //     id: 4,
      //     disc: 'Beast',
      //     speed: 10,
      //     type: 'Distance Driver',
      //     brand: 'innova',
      //     stable: true,
      //     plastics: 'star, gstar, champion, blizzard, pro, glow, dx'
      //   },
      // ];

      const data = await fakeRequest(app)
        .get('/discs')
        .expect('Content-Type', /json/)
        .expect(200);

      const titles = data.body.map(disc => disc.disc);

      expect(titles).toEqual(expectation);
      expect(titles.length).toBe(discsData.length);
      expect(data.body[0]).toEqual(expectedShape);
    });
    
    test('GET discs/:id returns an individual disc', async() => {
      const expectation = {
        id: 1,
        disc: 'Aviar',
        speed: 2,
        type: 'Putt/Approach',
        stable: true,
        plastics: 'star, gstar, champion, xt, r-pro, glow, dx',
        manufacturer: 'Innova'
      };
      const data = await fakeRequest(app)
        .get('/discs/1')
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(data.body).toEqual(expectation);
    });

    test('POST /discs creates a new disc', async () =>{
      const newDisc = {
        disc: 'Eagle',
        speed: 7,
        type: 'fairway driver',
        manufacturer_id: 1,
        stable: true,
        plastics: 'star, champion, dx'
      };

      const data = await fakeRequest(app)
        .post('/discs')
        .send(newDisc)
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(data.body.disc).toEqual(newDisc.disc);
      expect(data.body.id).toBeGreaterThan(0);
    });

    test('PUT /discs/:id updates a disc', async () => {
      const updatedDisc = {
        disc: 'AviarX',
        speed: 2,
        type: 'putt/approach',
        manufacturer_id: 1,
        stable: true,
        plastics: 'star, gstar, champion, xt, r-pro, glow, dx'
      };
      const data = await fakeRequest(app)
        .put('/discs/1')
        .send(updatedDisc)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(data.body.disc).toEqual(updatedDisc.disc);
      expect(data.body.manufacturer).toEqual(updatedDisc.manufacturer);
    });
  });
});




