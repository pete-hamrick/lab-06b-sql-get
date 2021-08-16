const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`          
            CREATE TABLE manufacturers (
              id SERIAL PRIMARY KEY,
              name VARCHAR(512) NOT NULL
            );    
    
            CREATE TABLE discs (
              id SERIAL PRIMARY KEY NOT NULL,
              disc VARCHAR(512) NOT NULL,
              speed INTEGER NOT NULL,
              type VARCHAR(512) NOT NULL,
              manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id),
              stable BOOL NOT NULL,
              plastics VARCHAR(512) NOT NULL
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
