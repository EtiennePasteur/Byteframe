const {Router} = require('express');
const Schedule = require('../modules/schedule');
const Schedules = require('../persistence/schedules');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const schedules = await Schedules.find(req.user.uuid);
    const sch = new Schedule(req.user, schedules);
    res.set('content-type', 'text/plain');
    const delay = await sch.delay();
    return res.status(200).send(delay.toString());
  } catch (error) {
    console.error(`next({ uuid: ${req.body.uuid} }) >> Error: ${error.stack}`);
    return res.status(500).json();
  }
});

module.exports = router;
