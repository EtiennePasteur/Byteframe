const {Router} = require('express');
const User = require('../persistence/users');
const Schedules = require('../persistence/schedules');
const Geocoder = require('../modules/geocoder');

const router = new Router();

const travel_mode = [{name: 'driving', selected: ''}, {name: 'bicycling', selected: ''}, {name: 'transit', selected: ''}, {name: 'walking', selected: ''}];
const image_choose = ['artwork', 'city', 'commute'];

router.get('/:uuid', async (req, res) => {
  try {
    const uuid = req.params.uuid;
    if (!uuid) return res.status(400).json({message: 'Uuid must be provided'});

    const user = await User.find(uuid);
    if (!user) return res.status(403).json({message: 'User not found'});

    const tm = travel_mode.find(t => t.name === user.travel_mode);
    if (tm !== undefined) tm.selected = 'selected';

    const schedules = await Schedules.find(uuid);

    res.render('index', {"user": user, "travel_mode": travel_mode, "schedules": schedules, "image_choose": image_choose, "sch_json": JSON.stringify(schedules)});
  } catch (error) {
    console.error(`hello({ uuid: ${req.params.uuid} }) >> Error: ${error.stack}`);
    return res.status(500).json();
  }
});

router.post('/:uuid', async (req, res) => {
  try {
    const uuid = req.params.uuid;
    if (!uuid) return res.status(400).json({message: 'Uuid must be provided'});

    const user = await User.find(uuid);
    if (!user) return res.status(403).json({message: 'User not found'});

    if (req.body) {
      let geoHome, geoWork;
      if (req.body.home) geoHome = await Geocoder.getGeo(req.body.home);
      if (req.body.work) geoWork = await Geocoder.getGeo(req.body.work);
      if (geoHome && geoHome[0]) geoHome = geoHome[0];
      if (geoWork && geoWork[0]) geoWork = geoWork[0];

      await User.update(uuid,
        geoHome ? geoHome.formattedAddress : null,
        geoHome ? geoHome.latitude : null,
        geoHome ? geoHome.longitude : null,
        geoWork ? geoWork.formattedAddress : null,
        geoWork ? geoWork.latitude : null,
        geoWork ? geoWork.longitude : null,
        req.body.travel_mode,
        user.next_image);

      const curSchs = [];
      for (const sch of req.body.schedules) {
        let s;
        if (sch.id) s = await Schedules.update(uuid, sch.id, sch.name, sch.cron_exp, sch.image);
        else s = await Schedules.insert(uuid, sch.name, sch.cron_exp, sch.image);
        curSchs.push(s.id);
      }

      const schedules = await Schedules.find(uuid);
      for (const sch of schedules) {
        if (!curSchs.includes(sch.id)) {
          await Schedules.remove(uuid, sch.id);
        }
      }
    }

    return res.status(200).json({message: 'Information updated'});
  } catch (error) {
    console.error(`hello({ uuid: ${req.params.uuid} }) >> Error: ${error.stack}`);
    return res.status(500).json();
  }
});

module.exports = router;
