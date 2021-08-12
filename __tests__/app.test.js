require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      // await client.connect();
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

      const expectation = [
        {
          id: 1,
          disc: 'Aviar',
          speed: 2,
          type: 'Putt/Approach',
          brand: 'innova',
          stable: true,
          plastics: 'star, gstar, champion, xt, r-pro, glow, dx'
        },
        {
          id: 2,
          disc: 'Roc',
          speed: 4,
          type: 'Midrange',
          brand: 'innova',
          stable: true,
          plastics: 'star, pro, glow, dx'
        },
        {
          id: 3,
          disc: 'Essence',
          speed: 8,
          type: 'Fairway Driver',
          brand: 'discmania',
          stable: false,
          plastics: 'neo, geo'
        },
        {
          id: 4,
          disc: 'Beast',
          speed: 10,
          type: 'Distance Driver',
          brand: 'innova',
          stable: true,
          plastics: 'star, gstar, champion, blizzard, pro, glow, dx'
        },
      ];

      const data = await fakeRequest(app)
        .get('/discs')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    
    test('returns discs/innova', async() => {
      const expectation = [
        {
          id: 1,
          disc: 'Aviar',
          speed: 2,
          type: 'Putt/Approach',
          brand: 'innova',
          stable: true,
          plastics: 'star, gstar, champion, xt, r-pro, glow, dx'
        },
        {
          id: 2,
          disc: 'Roc',
          speed: 4,
          type: 'Midrange',
          brand: 'innova',
          stable: true,
          plastics: 'star, pro, glow, dx'
        },
        {
          id: 4,
          disc: 'Beast',
          speed: 10,
          type: 'Distance Driver',
          brand: 'innova',
          stable: true,
          plastics: 'star, gstar, champion, blizzard, pro, glow, dx'
        },
      ];
    
      const data = await fakeRequest(app)
        .get('/discs/innova')
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(data.body).toEqual(expectation);
    });
  });
});




