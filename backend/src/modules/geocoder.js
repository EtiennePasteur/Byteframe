const NodeGeocoder = require('node-geocoder');

const options = { provider: 'google', apiKey: process.env.GOOGLE_KEY};
const geo = NodeGeocoder(options);

module.exports = {
  async getGeo(addr) {
    return geo.geocode(addr);
  }
}
