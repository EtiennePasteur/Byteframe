const express = require('express');
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const User = require('./src/persistence/users');
const api = require('./src/api');

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('assets'))

app.use(morgan('short'));

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/src/views');

app.use(async (req, res, next) => {
  if (req.path.startsWith('/hello') === true || req.path.startsWith('/backend') === true) {
    return next();
  }

  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({message: 'Missing Authorization Header'});
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [, password] = credentials.split(':');

  let user = await User.find(password);
  if (!user) {
    user = await User.insert(password);
  }

  req.user = user
  next();
});

app.use(api);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  }, stop() {
    server.close();
  }
};


