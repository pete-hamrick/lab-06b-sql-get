const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/discs', async(req, res) => {
  try {
    const data = await client.query(`SELECT discs.id,
      discs.disc,
      discs.speed,
      discs.type,
      discs.stable
      manufacturers.name AS manufacturer
      FROM discs INNER JOIN manufacturers
      ON discs.manufacturer_id = manufacturers.id
      ORDER BY discs.id;`
    );
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/manufacturers', async (req, res) => {
  try {
    const data = await client.query('SELECT * FROM manufacturers;');
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/discs/:id', async(req, res) => {
  const discId = req.params.id;
  try {
    const data = await client.query(`SELECT discs.id,
      discs.disc,
      discs.speed,
      discs.type,
      discs.stable
      manufacturers.name AS manufacturer
      FROM discs INNER JOIN manufacturers
      ON discs.manufacturer_id = manufacturers.id
      WHERE discs.id = $1
      ;`, [discId]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/discs', async(req, res)=>{
  try {
    const data = await client.query(`
      INSERT INTO discs(
        disc,
        speed,
        type,
        manufacturer_id,
        stable
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`, [
      req.body.disc,
      req.body.speed,
      req.body.type,
      req.body.manufacturer_id,
      req.body.stable
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});
app.put('/discs/:id', async(req, res)=>{
  try {
    const data = await client.query(`
    UPDATE discs
    SET
      disc=$2,
      speed=$3,
      type=$4,
      manufacturer_id=$5,
      stable=$6
    WHERE id = $1
    RETURNING *;
    `, [
      req.params.id,
      req.body.disc,
      req.body.speed,
      req.body.type,
      req.body.manufacturer_id,
      req.body.stable
    ]);
    res.json(data.rows[0]);
  }catch(e) {
    res.status(500).json({ error: e.message });
  }
});
app.use(require('./middleware/error'));

module.exports = app;
