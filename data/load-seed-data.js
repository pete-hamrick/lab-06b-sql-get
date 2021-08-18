const client = require('../lib/client');
// import our seed data:
const discsData = require('./discs.js');
const manufacturerData = require('./manufacturer.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      manufacturerData.map(maker => {
        return client.query(`
          INSERT INTO manufacturers (name)
          VALUES ($1)
          RETURNING *;
        `, 
        [maker.name]);
      })
    );
    
    await Promise.all(
      discsData.map(disc => {
        return client.query(`
          INSERT INTO discs (
            disc, 
            speed, 
            type, 
            manufacturer_id, 
            stable)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `,
        [disc.disc, 
          disc.speed, 
          disc.type, 
          disc.manufacturer_id, 
          disc.stable, 
        ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
