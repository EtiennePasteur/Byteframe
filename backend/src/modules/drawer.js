const {createCanvas, loadImage, registerFont} = require('canvas');
const fs = require('fs');
const https = require('https')
const City = require('./city');

const assets_path = 'assets/';

registerFont(assets_path + 'SubVario-Condensed-Medium.otf', {family: 'SubVario'});

class Drawer {
  user;
  city;
  iWidth = 800;
  iHeight = 480;
  curPal = [[0, 0, 0], [255, 255, 255], [255, 0, 0]];

  constructor(user) {
    this.user = user;
    this.city = new City(this.user, `${assets_path}city/`);
  }

  setVal(p, i, c) {
    p.data[i] = this.curPal[c][0];
    p.data[i + 1] = this.curPal[c][1];
    p.data[i + 2] = this.curPal[c][2];
    p.data[i + 3] = 255;
  }

  getErr(r, g, b, stdCol) {
    r -= stdCol[0];
    g -= stdCol[1];
    b -= stdCol[2];
    return r * r + g * g + b * b;
  }

  getNear(r, g, b) {
    let ind = 0;
    let err = this.getErr(r, g, b, this.curPal[0]);
    for (let i = 1; i < this.curPal.length; i++) {
      let cur = this.getErr(r, g, b, this.curPal[i]);
      if (cur < err) {
        err = cur;
        ind = i;
      }
    }
    return ind;
  }

  getVal(p, i) {
    if ((p.data[i] === 0x00) && (p.data[i + 1] === 0x00)) return 0;
    if ((p.data[i] === 0xFF) && (p.data[i + 1] === 0xFF)) return 1;
    if ((p.data[i] === 0x7F) && (p.data[i + 1] === 0x7F)) return 2;
    return 3;
  }

  getData(a, c) {
    let pxInd = 0;
    let rqMsg = '';
    while (pxInd < a.length) {
      let v = 0;
      for (let i = 0; i < 8; i++) {
        if ((pxInd < a.length) && (a[pxInd++] !== c)) v |= (128 >> i);
      }
      rqMsg += String.fromCharCode((v & 0xF) + 97, ((v >> 4) & 0xF) + 97);
    }
    return rqMsg;
  }

  processCanvas(sourceCtx) {
    const canvas = createCanvas(this.iWidth, this.iHeight);
    const canvasCtx = canvas.getContext('2d')

    let i = 0;
    let index = 0;
    const pSrc = sourceCtx.getImageData(0, 0, this.iWidth, this.iHeight);
    const pDst = canvasCtx.getImageData(0, 0, this.iWidth, this.iHeight);

    for (let j = 0; j < this.iHeight; j++) {
      if (j >= this.iHeight) {
        for (i = 0; i < this.iWidth; i++, index += 4) {
          this.setVal(pDst, index, (i + j) % 2 === 0 ? 1 : 0);
        }
        continue;
      }
      for (i = 0; i < this.iWidth; i++) {
        if (i >= this.iWidth) {
          this.setVal(pDst, index, (i + j) % 2 === 0 ? 1 : 0);
          index += 4;
          continue;
        }
        let pos = (j * this.iWidth + i) * 4;
        this.setVal(pDst, index, this.getNear(pSrc.data[pos], pSrc.data[pos + 1], pSrc.data[pos + 2]));
        index += 4;
      }
    }
    canvasCtx.putImageData(pDst, 0, 0);
    let p = canvasCtx.getImageData(0, 0, this.iWidth, this.iHeight);
    let a = new Array(this.iWidth * this.iHeight);
    i = 0;
    for (let y = 0; y < this.iHeight; y++) {
      for (let x = 0; x < this.iWidth; x++, i++) {
        a[i] = this.getVal(p, i << 2);
      }
    }
    const img = {}
    img.gif = canvas.toBuffer();
    img.black = this.getData(a, 0);
    img.red = this.getData(a, 3);
    return img;
  }

  async getArtwork() {
    const sourceCtx = createCanvas(this.iWidth, this.iHeight).getContext('2d');
    const filesDir = fs.readdirSync(assets_path + 'artwork/');
    const chosenFile = filesDir[Math.floor(Math.random() * filesDir.length)]
    const image = await loadImage(assets_path + 'artwork/' + chosenFile);
    sourceCtx.drawImage(image, 0, 0, this.iWidth, this.iHeight);
    return this.processCanvas(sourceCtx);
  }

  async getSetup() {
    const sourceCtx = createCanvas(this.iWidth, this.iHeight).getContext('2d');
    sourceCtx.fillStyle = "red";
    sourceCtx.fillRect(0, 0, this.iWidth, this.iHeight);
    const image = await loadImage(assets_path + 'computer.png');
    sourceCtx.drawImage(image, (this.iWidth / 2) - (image.width / 2), (this.iHeight / 2) - (image.height / 2) - 25, image.width, image.height);
    sourceCtx.font = '24px "SubVario"'
    sourceCtx.fillStyle = "white";
    const textWidth = sourceCtx.measureText(process.env.URL_BACKEND + 'hello/' + this.user.uuid).width;
    sourceCtx.fillText(process.env.URL_BACKEND + 'hello/' + this.user.uuid, (this.iWidth / 2) - (textWidth / 2), (this.iHeight / 2) + 40);
    return this.processCanvas(sourceCtx);
  }

  async doHttpRequest(options) {
    return await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString()));
        res.on("error", (error) => reject(error));
      });
      req.end();
    });
  }

  async getCommute() {
    let options = {
      'method': 'GET',
      'hostname': 'maps.googleapis.com',
      'path': '/maps/api/directions/json' +
        '?key=' + process.env.GOOGLE_KEY +
        '&origin=' + this.user.home_lat + ',' + this.user.home_lng +
        '&destination=' + this.user.work_lat + ',' + this.user.work_lng +
        '&mode=' + this.user.travel_mode +
        '&departure_time=now',
    };
    const directions = JSON.parse(await this.doHttpRequest(options));
    const route = directions['routes'][0];
    const polyline = route['overview_polyline']['points'];
    const summary = route['summary'];
    const leg = route['legs'][0];
    const duration = leg['duration']['text'];

    const map = 'https://maps.googleapis.com/maps/api/staticmap' +
      '?key=' + process.env.GOOGLE_KEY +
      '&size=640x384' +
      '&maptype=roadmap' +
      '&style=feature:administrative|visibility:off' +
      '&style=feature:poi|visibility:off' +
      '&style=feature:all|element:labels|visibility:off' +
      '&style=feature:landscape|color:0xffffff' +
      '&style=feature:road|color:0x000000' +
      '&style=feature:transit|color:0xffffff' +
      '&style=feature:transit.line|color:0x000000' +
      '&style=feature:water|color:0x000000' +
      '&format=png' +
      '&scale=1' +
      '&path=color:0xff0000ff|weight:6|enc:' + polyline;
    const sourceCtx = createCanvas(this.iWidth, this.iHeight).getContext('2d');
    const image = await loadImage(map);
    sourceCtx.drawImage(image, 0, 0, this.iWidth, this.iHeight);
    sourceCtx.font = '24px "SubVario"'
    const directions_text = summary ? `${duration} via ${summary}` : duration;
    const textWidth = sourceCtx.measureText(directions_text).width;
    const boxHeight = 50;
    sourceCtx.fillStyle = "white";
    sourceCtx.fillRect((this.iWidth / 2) - (textWidth / 2) - 15 - 3, (this.iHeight / 2) - (boxHeight / 2) - 3, textWidth + 30 + 6, boxHeight + 6);
    sourceCtx.fillStyle = "black";
    sourceCtx.fillRect((this.iWidth / 2) - (textWidth / 2) - 15, (this.iHeight / 2) - (boxHeight / 2), textWidth + 30, boxHeight);
    sourceCtx.fillStyle = "white";
    sourceCtx.fillText(directions_text, (this.iWidth / 2) - (textWidth / 2), (this.iHeight / 2) + 8);
    return this.processCanvas(sourceCtx);
  }

  async getCity() {
    let sourceCtx = createCanvas(this.iWidth, this.iHeight).getContext('2d');
    sourceCtx = await this.city.drawCity(sourceCtx);
    return this.processCanvas(sourceCtx);
  }

  async imageResponse() {
    if (this.user.next_image === 'artwork') {
      return await this.getArtwork();
    } else if (this.user.next_image === 'setup') {
      return await this.getSetup();
    } else if (this.user.next_image === 'commute') {
      return await this.getCommute();
    } else if (this.user.next_image === 'city') {
      return await this.getCity();
    }
  }
}

module.exports = Drawer
