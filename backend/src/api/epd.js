const {Router} = require('express');
const Drawer = require('../modules/drawer');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const color = req.query.color;
    if (!color) return res.status(400).json({message: 'A color must be provided'});
    else if (!(color === 'black' || color === 'red' || color === 'gif')) return res.status(400).json({message: 'Color must be : \'black\' | \'red\' | \'gif\' '});

    if (color === "gif") res.setHeader('Content-Type', 'image/gif');
    else res.setHeader('Content-Type', 'text/plain');

    const resp = new Drawer(req.user);
    const img = await resp.imageResponse();
    return res.status(200).send(img[color]);
  } catch (error) {
    console.error(`epd() >> Error: ${error.stack}`);
    return res.status(500).json();
  }
});

module.exports = router;
