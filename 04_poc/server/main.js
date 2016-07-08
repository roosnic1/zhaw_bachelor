
const apiRouter = require('./api');

const express = require('express');
const logger = require('winston');
const bodyParser = require('body-parser');

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production'; // eslint-disable-line no-unused-vars
const ENV_TEST = NODE_ENV === 'test'; // eslint-disable-line no-unused-vars


//=========================================================
//  SETUP
//---------------------------------------------------------
const PROJECT_ROOT_DIR = process.cwd();

const app = express();

app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 3001);

app.use(require('morgan')('dev'));
app.use(express.static(`${PROJECT_ROOT_DIR}/target`));

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

if (ENV_DEVELOPMENT) {
  // CORS middleware
  app.use(allowCrossDomain);
}

//=========================================================
// API  ROUTER
//---------------------------------------------------------
apiRouter.connectToLobo();
app.use('/api/v1', apiRouter);



//=========================================================
//  ROUTER
//---------------------------------------------------------
const router = new express.Router();

router.get('*', (req, res) => {
  res.sendFile(`${PROJECT_ROOT_DIR}/target/index.html`);
});

app.use(router);


//=========================================================
//  START SERVER
//---------------------------------------------------------
app.listen(app.get('port'), app.get('host'), error => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Server listening @ ${app.get('host')}:${app.get('port')}`);
  }
});
