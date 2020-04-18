const LocalTime = require('./local-time');
const parser = require('cron-parser');
const User = require('../persistence/users');

class Schedule {
  user;
  schedules;
  time;
  tz;
  sunset;
  sunrise;

  constructor(user, schedules) {
    this.user = user;
    this.schedules = schedules;
    let lat, lng;
    if (this.user.home_lat && this.user.home_lng) {
      lat = this.user.home_lat;
      lng = this.user.home_lng;
    } else {
      lat = 48.8534; // Default: Paris latitude
      lng = 2.3488; // Default: Paris longitude
    }
    this.time = LocalTime.now();
    this.tz = LocalTime.timezone(lat, lng);
    this.sunset = LocalTime.sunset(lat, lng);
    this.sunrise = LocalTime.sunrise(lat, lng);
  }

  next() {
    const options = {currentDate: this.time, tz: this.tz};
    const nextCron = []
    for (const sch of this.schedules) {
      if (sch.cron_exp.includes('sunrise')) sch.cron_exp = sch.cron_exp.replace('sunrise', `${this.sunrise.getMinutes()} ${this.sunrise.getHours()}`);
      if (sch.cron_exp.includes('sunset')) sch.cron_exp = sch.cron_exp.replace('sunset', `${this.sunset.getMinutes()} ${this.sunset.getHours()}`);
      const cron = parser.parseExpression(sch.cron_exp, options);
      nextCron.push({id: sch.id, image: sch.image, start: cron.next().toDate()});
    }
    return nextCron.reduce((a, b) => {
      return new Date(a.start) < new Date(b.start) ? a : b;
    });
  }

  async delay() {
    let d = 60000;
    let i = 'setup'
    if (this.schedules.length > 0) {
      const cron = this.next();
      d = cron.start.getTime() - this.time.getTime();
      i = cron.image;
    }
    await User.update(
      this.user.uuid,
      this.user.home, this.user.home_lat, this.user.home_lng,
      this.user.work, this.user.work_lat, this.user.work_lng,
      this.user.travel_mode,
      i);
    return d;
  }
}

module.exports = Schedule
