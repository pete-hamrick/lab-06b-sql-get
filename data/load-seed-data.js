const client = require('../lib/client');
// import our seed data:
const discs = require('./discs.js');
const manufacturers = require('./manufacturer.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      discs.map(disc => {
        return client.query(`
                    INSERT INTO discs (disc, speed, type, brand, stable, plastics)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [disc.disc, disc.speed, disc.type, disc.brand, disc.stable, disc.plastics]);
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
