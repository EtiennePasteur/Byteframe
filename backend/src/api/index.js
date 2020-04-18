const express = require('express');

const {Router} = express;
const router = new Router();

const next = require('./next');
const epd = require('./epd');
const hello = require('./hello');

// FRAME ROUTES
router.use('/api/next', next);
router.use('/api/epd', epd);

// USER ROUTES
router.use('/hello', hello);

module.exports = router;
