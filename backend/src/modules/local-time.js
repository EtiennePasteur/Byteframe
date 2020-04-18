const geoTz = require('geo-tz')
const sun = require('sunrise-sunset-js');

module.exports = {
  timezone(lat, lng) {
    const tz = geoTz(lat, lng);
    return tz[0];
  },
  now() {
    return new Date();
  },
  sunrise(lat, lng) {
    return new Date(sun.getSunrise(lat, lng).toLocaleString("en-US", {timeZone: this.timezone(lat, lng)}));
  },
  sunset(lat, lng) {
    return new Date(sun.getSunset(lat, lng).toLocaleString("en-US", {timeZone: this.timezone(lat, lng)}));
  },
  isDaylight(lat, lng) {
    const n = new Date(this.now().toLocaleString("en-US", {timeZone: this.timezone(lat, lng)}));
    return (n > this.sunrise(lat, lng) && n < this.sunset(lat, lng));
  }
}
