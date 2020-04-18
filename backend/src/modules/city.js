const LocalTime = require('./local-time');
const Weather = require('./weather');
const {loadImage} = require('canvas');

class City {
  user;
  weather = new Weather();
  assets_path;

  constructor(user, assets_path) {
    this.user = user;
    this.weather.user = this.user;
    this.assets_path = assets_path;
  }

  cityJson = [
    {
      condition: LocalTime.isDaylight.bind(LocalTime),
      layers: [
        {
          file: 'day/environment/water-day.png',
          xy: [-80, -48],
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/environment/water-flat-day.png',
          xy: [-80, -48],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/environment/isle-day.png',
          xy: [-80, -48]
        },
        {
          file: 'day/blocks/bldg-facstdo-day.png',
          xy: [262, 9]
        },
        {
          file: 'day/misc/lightpole-day.png',
          xy: [130, 5]
        },
        {
          file: 'day/blocks/bldg-verylittlegravitas-day.png',
          xy: [188, 18]
        },
        {
          file: 'day/blocks/block-D-day.png',
          xy: [74, 59]
        },
        {
          file: 'day/vehicles/van2-247-yp-day.png',
          xy: [156, 116],
          probability: 50
        },
        {
          file: 'day/misc/streetlight-xp-day.png',
          xy: [314, 11]
        },
        {
          file: 'day/blocks/block-F-day.png',
          xy: [418, 6]
        },
        {
          file: 'day/blocks/bldg-home-day.png',
          xy: [422, 36]
        },
        {
          file: 'day/vehicles/boat3-yp-day.png',
          xy: [590, 87],
          probability: 50
        },
        {
          file: 'day/characters/blockbob/blockbob-driving-xp-day.png',
          xy: [418, 109],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/blockbob/blockbob-driving-xp-day-rain.png',
          xy: [418, 93],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/blocks/bldg-robosuper-day.png',
          xy: [540, 116]
        },
        {
          file: 'day/blocks/block-A/block-A-day.png',
          xy: [200, 6],
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/blocks/block-A/block-A-day-rain.png',
          xy: [200, 6],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/blockbob/blockbob-sitting-day.png',
          xy: [276, 78],
          else_condition: [
            'day/characters/blockbob/blockbob-driving-xp-day.png',
            'day/characters/blockbob/blockbob-driving-xp-day-rain.png'
          ],
        },
        {
          file: 'day/misc/computersays/billboard-computer-no-day.png',
          xy: [386, 51],
          probability: 50
        },
        {
          file: 'day/misc/computersays/billboard-computer-yes-day.png',
          xy: [386, 51],
          else_condition: [
            'day/misc/computersays/billboard-computer-no-day.png'
          ]
        },
        {
          file: 'day/misc/3letterLED/3letterLED-UFO-day.png',
          xy: [354, 125],
          condition: this.modulo_3_0.bind(this)
        },
        {
          file: 'day/misc/3letterLED/3letterLED-LOL-day.png',
          xy: [354, 125],
          condition: this.modulo_3_1.bind(this)
        },
        {
          file: 'day/misc/3letterLED/3letterLED-404-day.png',
          xy: [354, 125],
          condition: this.modulo_3_2.bind(this)
        },
        {
          file: 'day/misc/streetlight-yp-day.png',
          xy: [168, 125]
        },
        {
          file: 'day/characters/robogroup/robogroup-day.png',
          xy: [554, 168],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/robogroup/robogroup-day-rain.png',
          xy: [547, 157],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/misc/streetlight-xm-day.png',
          xy: [596, 164]
        },
        {
          file: 'day/misc/streetlight-yp-day.png',
          xy: [516, 119]
        },
        {
          file: 'day/characters/deliverybiker/deliverybiker-xm-day.png',
          xy: [500, 142],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/deliverybiker/deliverybiker-xm-day-rain.png',
          xy: [492, 135],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/blocks/block-E/block-E-day.png',
          xy: [12, 51],
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/blocks/block-E/block-E-day-rain.png',
          xy: [12, 51],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/vehicles/boat1/boat1-yp-day.png',
          xy: [6, 238],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/vehicles/boat1/boat1-yp-day-rain.png',
          xy: [6, 216],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/misc/bench-day.png',
          xy: [48, 245]
        },
        {
          file: 'day/vehicles/boat2-ym-day.png',
          xy: [12, 261],
          probability: 50
        },
        {
          file: 'day/characters/ladybiker/ladybiker-day.png',
          xy: [102, 251],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/ladybiker/ladybiker-day-rain.png',
          xy: [102, 234],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/misc/streetlight-ym-day.png',
          xy: [38, 224]
        },
        {
          file: 'day/vehicles/van1-yp-day.png',
          xy: [412, 164],
          probability: 50
        },
        {
          file: 'day/vehicles/van2-milk-yp-day.png',
          xy: [440, 158],
          probability: 50
        },
        {
          file: 'day/vehicles/van2-yp-day.png',
          xy: [388, 184],
          probability: 50
        },
        {
          file: 'day/vehicles/car2-xp-day.png',
          xy: [236, 213],
          probability: 50
        },
        {
          file: 'day/vehicles/car1-yp-day.png',
          xy: [152, 266],
          probability: 50
        },
        {
          file: 'day/blocks/block-B-day.png',
          xy: [334, 191]
        },
        {
          file: 'day/misc/cleat-x-day.png',
          xy: [518, 285]
        },
        {
          file: 'day/characters/robogroup/robogroup-barge-empty-xm-day.png',
          xy: [574, 222],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/robogroup/robogroup-barge-empty-xm-day-rain.png',
          xy: [574, 218],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/blocks/bldg-jetty-day.png',
          xy: [516, 230]
        },
        {
          file: 'day/misc/streetlight-yp-day.png',
          xy: [528, 255]
        },
        {
          file: 'day/blocks/park-day.png',
          xy: [379, 252]
        },
        {
          file: 'day/characters/dogcouple-day.png',
          xy: [509, 312],
          probability: 50
        },
        {
          file: 'day/characters/girl/girlwbird-day.png',
          xy: [400, 315],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/girl/girlwbird-day-rain.png',
          xy: [404, 303],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/misc/streetlight-ym-day.png',
          xy: [294, 218]
        },
        {
          file: 'day/blocks/block-C-day.png',
          xy: [216, 197]
        },
        {
          file: 'day/misc/cleat-y-day.png',
          xy: [400, 346]
        },
        {
          file: 'day/characters/vrguys/vrguy-A-day.png',
          xy: [217, 298],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/vrguys/vrguy-A-day-rain.png',
          xy: [203, 276],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/vrguys/vrguy-B-day.png',
          xy: [240, 305],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/characters/vrguys/vrguy-B-day-rain.png',
          xy: [234, 293],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/blocks/bldg-honeybucket-day.png',
          xy: [146, 291]
        },
        {
          file: 'day/misc/memorial-minicyclops-day.png',
          xy: [40, 291]
        },
        {
          file: 'day/misc/cleat-y-day.png',
          xy: [10, 309]
        },
        {
          file: 'day/misc/cleat-y-day.png',
          xy: [26, 317]
        },
        {
          file: 'day/misc/memorial-cyclops-day.png',
          xy: [62, 289]
        },
        {
          file: 'day/vehicles/yacht2-xm-day.png',
          xy: [544, 302],
          probability: 50
        },
        {
          file: 'day/vehicles/yacht1-xm-day.png',
          xy: [506, 334],
          probability: 50
        },
        {
          file: 'day/vehicles/houseboat/houseboat-day.png',
          xy: [163, 326],
          probability: 50
        },
        {
          file: 'day/misc/streetlight-xp-day.png',
          xy: [216, 322]
        },
        {
          file: 'day/environment/sun-day.png',
          xy: [-30, -30]
        },
        {
          file: 'day/environment/rain1-day.png',
          xy: [-80, -48],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'day/environment/cloud1-day.png',
          xy: [523, 5],
          or_condition: [this.weather.is_partly_cloudy.bind(this.weather), this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud2-day.png',
          xy: [-43, 41],
          or_condition: [this.weather.is_partly_cloudy.bind(this.weather), this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud2-day.png',
          xy: [519, 177],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud3-day.png',
          xy: [49, 96],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud4-day.png',
          xy: [195, 156],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud5-day.png',
          xy: [339, 70],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud6-day.png',
          xy: [93, 264],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud7-day.png',
          xy: [472, 247],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'day/environment/cloud8-day.png',
          xy: [-18, 314],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        }
      ]
    },
    {
      not_condition: LocalTime.isDaylight.bind(LocalTime),
      layers: [
        {
          file: 'night/environment/water-night.png',
          xy: [-80, -48],
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/environment/water-flat-night.png',
          xy: [-80, -48],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/environment/isle-night.png',
          xy: [-80, -48]
        },
        {
          file: 'night/blocks/bldg-facstdo-night.png',
          xy: [262, 9]
        },
        {
          file: 'night/misc/lightpole-night.png',
          xy: [130, 5]
        },
        {
          file: 'night/blocks/bldg-verylittlegravitas-night.png',
          xy: [188, 18]
        },
        {
          file: 'night/blocks/block-D-night.png',
          xy: [74, 59]
        },
        {
          file: 'night/vehicles/van2-247-yp-night.png',
          xy: [142, 116],
          probability: 50
        },
        {
          file: 'night/misc/streetlight-xp-night.png',
          xy: [314, 11]
        },
        {
          file: 'night/blocks/block-F-night.png',
          xy: [418, 6]
        },
        {
          file: 'night/blocks/bldg-home-night.png',
          xy: [422, 36]
        },
        {
          file: 'night/vehicles/boat3-yp-night.png',
          xy: [590, 87],
          probability: 80
        },
        {
          file: 'night/characters/blockbob/blockbob-driving-xp-night.png',
          xy: [418, 109],
          probability: 50,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/characters/blockbob/blockbob-driving-xp-night-rain.png',
          xy: [418, 93],
          probability: 50,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/blocks/bldg-robosuper-night.png',
          xy: [540, 116]
        },
        {
          file: 'night/characters/dogcouple-night.png',
          xy: [578, 175]
        },
        {
          file: 'night/vehicles/car3-yp-night.png',
          xy: [532, 186],
          probability: 50
        },
        {
          file: 'night/blocks/block-A/block-A-night.png',
          xy: [200, 6],
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/blocks/block-A/block-A-night-rain.png',
          xy: [200, 6],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/characters/blockbob/blockbob-sitting-night.png',
          xy: [276, 78],
          else_condition: [
            'night/characters/blockbob/blockbob-driving-xp-night.png',
            'night/characters/blockbob/blockbob-driving-xp-night-rain.png'
          ]
        },
        {
          file: 'night/misc/computersays/billboard-computer-no-night.png',
          xy: [386, 51],
          probability: 50
        },
        {
          file: 'night/misc/computersays/billboard-computer-yes-night.png',
          xy: [386, 51],
          else_condition: [
            'night/misc/computersays/billboard-computer-no-night.png'
          ]
        },
        {
          file: 'night/misc/3letterLED/3letterLED-UFO-night.png',
          xy: [354, 125],
          condition: this.modulo_3_0.bind(this)
        },
        {
          file: 'night/misc/3letterLED/3letterLED-LOL-night.png',
          xy: [354, 125],
          condition: this.modulo_3_1.bind(this)
        },
        {
          file: 'night/misc/3letterLED/3letterLED-404-night.png',
          xy: [354, 125],
          condition: this.modulo_3_2.bind(this)
        },
        {
          file: 'night/misc/streetlight-yp-night.png',
          xy: [168, 125]
        },
        {
          file: 'night/misc/streetlight-xm-night.png',
          xy: [596, 164]
        },
        {
          file: 'night/misc/streetlight-yp-night.png',
          xy: [516, 119]
        },
        {
          file: 'night/blocks/block-E-night.png',
          xy: [12, 51]
        },
        {
          file: 'night/vehicles/boat1-yp-night.png',
          xy: [6, 238],
          probability: 80,
          not_condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/vehicles/boat1-yp-night-rain.png',
          xy: [6, 216],
          probability: 80,
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/misc/bench-night.png',
          xy: [48, 245]
        },
        {
          file: 'night/vehicles/boat2-ym-night.png',
          xy: [12, 261],
          probability: 80
        },
        {
          file: 'night/misc/streetlight-ym-night.png',
          xy: [38, 224]
        },
        {
          file: 'night/vehicles/van1-yp-night.png',
          xy: [400, 164],
          probability: 50
        },
        {
          file: 'night/vehicles/van2-milk-yp-night.png',
          xy: [440, 158],
          probability: 50
        },
        {
          file: 'night/vehicles/van2-yp-night.png',
          xy: [374, 184],
          probability: 50
        },
        {
          file: 'night/vehicles/car2-xp-night.png',
          xy: [236, 213],
          probability: 50
        },
        {
          file: 'night/vehicles/car1-yp-night.png',
          xy: [138, 266],
          probability: 50
        },
        {
          file: 'night/blocks/block-B-night.png',
          xy: [334, 191]
        },
        {
          file: 'night/misc/cleat-x-night.png',
          xy: [518, 285]
        },
        {
          file: 'night/characters/robogroup/robogroup-barge-xm-night.png',
          xy: [574, 222],
          probability: 50
        },
        {
          file: 'night/blocks/bldg-jetty-night.png',
          xy: [516, 230]
        },
        {
          file: 'night/misc/streetlight-yp-night.png',
          xy: [528, 255]
        },
        {
          file: 'night/blocks/park-night.png',
          xy: [379, 252]
        },
        {
          file: 'night/misc/streetlight-ym-night.png',
          xy: [294, 218]
        },
        {
          file: 'night/blocks/block-C-night.png',
          xy: [216, 197]
        },
        {
          file: 'night/misc/cleat-y-night.png',
          xy: [400, 346]
        },
        {
          file: 'night/blocks/bldg-honeybucket-night.png',
          xy: [146, 291]
        },
        {
          file: 'night/misc/memorial-minicyclops-night.png',
          xy: [40, 291]
        },
        {
          file: 'night/misc/cleat-y-night.png',
          xy: [10, 309]
        },
        {
          file: 'night/misc/cleat-y-night.png',
          xy: [26, 317]
        },
        {
          file: 'night/misc/memorial-cyclops-night.png',
          xy: [62, 289]
        },
        {
          file: 'night/vehicles/yacht2-xm-night.png',
          xy: [544, 302],
          probability: 80
        },
        {
          file: 'night/vehicles/yacht1-xm-night.png',
          xy: [506, 334],
          probability: 80
        },
        {
          file: 'night/vehicles/houseboat/houseboat-night.png',
          xy: [163, 326],
          probability: 80
        },
        {
          file: 'night/misc/streetlight-xp-night.png',
          xy: [216, 322]
        },
        {
          file: 'night/environment/moon-night.png',
          xy: [-30, -30]
        },
        {
          file: 'night/environment/rain1-night.png',
          xy: [-80, -48],
          condition: this.weather.is_rainy.bind(this.weather)
        },
        {
          file: 'night/environment/cloud1-night.png',
          xy: [523, 5],
          or_condition: [this.weather.is_partly_cloudy.bind(this.weather), this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud2-night.png',
          xy: [-43, 41],
          or_condition: [this.weather.is_partly_cloudy.bind(this.weather), this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud2-night.png',
          xy: [519, 177],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud3-night.png',
          xy: [49, 96],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud4-night.png',
          xy: [195, 156],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud5-night.png',
          xy: [339, 70],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud6-night.png',
          xy: [93, 264],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud7-night.png',
          xy: [472, 247],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        },
        {
          file: 'night/environment/cloud8-night.png',
          xy: [-18, 314],
          or_condition: [this.weather.is_cloudy.bind(this.weather), this.weather.is_rainy.bind(this.weather)]
        }
      ]
    }]

  async draw_layers(image, layers) {
    let drawn_files = []
    for (const layer of layers) {
      if (layer['condition'] && !layer['condition'](this.user.home_lat, this.user.home_lng)) continue;
      if (layer['not_condition'] && layer['not_condition'](this.user.home_lat, this.user.home_lng)) continue;
      if (layer['and_condition'] && !layer['and_condition'].every((c => c(this.user.home_lat, this.user.home_lng)))) continue;
      if (layer['or_condition'] && !layer['or_condition'].some((c => c(this.user.home_lat, this.user.home_lng)))) continue;
      if (layer['else_condition'] && (drawn_files.filter(v => layer['else_condition'].includes(v))).length > 0) continue;
      if (layer['probability'] && layer['probability'] <= 100 * Math.random()) continue;
      if (layer['layers'] && layer['layers'].length > 0) {
        await this.draw_layers(image, layer['layers']);
        continue;
      }

      const img = await loadImage(`${this.assets_path}${layer['file']}`);
      image.drawImage(img, layer['xy'][0] + 80, layer['xy'][1] + 48, img.width, img.height);

      drawn_files.push(layer['file']);
    }
    return image;
  }

  async drawCity(image) {
    return await this.draw_layers(image, this.cityJson)
  }

  daysOfYear() {
    const date = new Date(LocalTime.now().toLocaleString("en-US", {timeZone: LocalTime.timezone(this.user.home_lat, this.user.home_lng)}))
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  }

  modulo_3_0() {
    return this.daysOfYear() % 3 === 0
  }

  modulo_3_1() {
    return this.daysOfYear() % 3 === 1
  }

  modulo_3_2() {
    return this.daysOfYear() % 3 === 2
  }
}

module.exports = City;
