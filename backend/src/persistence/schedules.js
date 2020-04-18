const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async insert(user_uuid, name, cron_exp, image) {
    try {
      const {rows} = await db.query(sql`INSERT INTO schedules (user_uuid, name, cron_exp, image) VALUES (${user_uuid}, ${name}, ${cron_exp}, ${image}) RETURNING *;`);
      const [schedule] = rows;
      return schedule;
    } catch (error) {}
  },
  async update(user_uuid, id, name, cron_exp, image) {
    try {
      const {rows} = await db.query(sql`UPDATE schedules SET name = ${name}, cron_exp = ${cron_exp}, image = ${image} WHERE id = ${id} AND user_uuid = ${user_uuid} RETURNING *;`);
      const [schedule] = rows;
      return schedule;
    } catch (error) {}
  },
  async find(uuid) {
    const {rows} = await db.query(sql`SELECT * FROM schedules WHERE user_uuid = ${uuid};`);
    return rows;
  },
  async remove(uuid, id) {
    const {rows} = await db.query(sql`DELETE FROM schedules WHERE user_uuid = ${uuid} AND id = ${id};`);
    return rows;
  }
};
