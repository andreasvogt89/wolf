const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const logger = require('./serverlog/logger');
const { connectDb } = require('./mongodb');
const bcrypt = require('bcrypt');

require('dotenv').config();

const middlewares = require('./middlewares');
const easyWay = require('./easyway/easyway');
const { User } = require('./mongodb');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({
    message: 'Server is running 💩'
  });
});

require('dotenv').config();

connectDb().then(()=>{
  logger.info("DB connection successful!");
  //bcrypt.hash("4556@A89xy$$", 2, function(err, hash) {
   // User.create({username:"Andreas", password:hash});});
}).catch(err=>{
  logger.error("DB connection failed: " + err)
});

app.post('/login', async (req, res, next) => {
  // Read username and password from request body
  logger.info('login from: ' + req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  try {
    const user = await User.find({username: req.body.username});
    const match = await bcrypt.compare(req.body.password, user[0].password);
      if (match) {
        // Generate an access token
        const accessToken = jwt.sign({
          username: req.body.username,
          role: req.body.role
        }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.status(200).json({
          accessToken
        });
      } else {
        res.status(401).send(new Error("Wrong password or username"));
      }
  } catch (err) {
    logger.error('Auth failed:' + err.message);
    next(err);
  }
});


app.use('/easyway', easyWay);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);



module.exports = app;
