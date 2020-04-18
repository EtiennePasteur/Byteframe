const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async insert(uuid) {
    try {
      const {rows} = await db.query(sql`INSERT INTO users (uuid) VALUES (${uuid}) RETURNING *;`);
      const [user] = rows;
      return user;
    } catch (error) {
    }
  },
  async update(uuid, home, home_lat, home_lng, work, work_lat, work_lng, travel_mode, next_image) {
    try {
      const {rows} = await db.query(sql`
        UPDATE users SET
            home = ${home},
            home_lat = ${home_lat},
            home_lng = ${home_lng},
            work = ${work},
            work_lat = ${work_lat},
            work_lng = ${work_lng},
            travel_mode = ${travel_mode},
            next_image = ${next_image}
        WHERE uuid = ${uuid} RETURNING *;`);
      const [user] = rows;
      return user;
    } catch (error) {
    }
  },
  async find(uuid) {
    const {rows} = await db.query(sql`SELECT * FROM users WHERE uuid = ${uuid} LIMIT 1;`);
    return rows[0];
  }
};
