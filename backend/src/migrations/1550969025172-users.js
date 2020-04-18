const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users
    (
      uuid        text not null PRIMARY KEY,
      home        text,
      home_lat    text,
      home_lng    text,
      work        text,
      work_lat    text,
      work_lng    text,
      travel_mode text,
      next_image  text default 'setup'
    );
    CREATE TABLE IF NOT EXISTS schedules
    (
      id        serial PRIMARY KEY,
      user_uuid text not null references users (uuid),
      name      text,
      cron_exp  text,
      image     text
    );
  `);

  await client.query(`
    CREATE INDEX users_uuid on users (uuid);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TABLE users;
    DROP TABLE schedules;
  `);

  await client.release(true);
  next();
};
