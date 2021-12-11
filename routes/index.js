var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
var axios = require('axios');

dotenv.config();





const { check, validationResult } = require('express-validator');
// initiate mongoose
const mongoose = require('mongoose');
// initiate user model
const User = require('../models/user');
// connect to mongoose
mongoose.connect(process.env.DB_URL);
// initiate db
const db = mongoose.connection;
// check db connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// check for db errors
db.on('error', (err) => {
  console.log(err);
});
"use strict";
const nodemailer = require("nodemailer");
const Activation = require('../models/activation');
const Api = require('../models/api');
const cookieParser = require('cookie-parser');




validate = [
  check('sub', 'Subject length should be 3 to 25 characters')
    .isLength({ min: 2, max: 250 }),
  check('name', 'Name length should be 3 to 25 characters')
    .isLength({ min: 3, max: 250}),
  check('link', 'Link length should be 3 to 250 characters')
    .isLength({ min: 3, max: 250 }),
  check('type', 'Select resource type')
    .isLength({ min: 3, max: 250 }),

]


/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Membership Form', Key: process.env.PAY_KEY_ID });
});
router.get('/data', (req, res) => {
  // get data from activation
  User.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});




router.post('/free-reg', validate, async (req, res) => {
  const errors = validationResult(req);

  // If some error occurs, then this
  // block of code will run
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.render('index', { errors: errors.array() });
  }

  // If no error occurs, then this
  // block of code will run
  else {
    const { sub, link, date, type } = req.body;

    // save to db
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      sub: req.body.sub,
      link: req.body.link,
      date: req.body.date,
      type: req.body.type,
      uuid: getRandomString(4)
    });
    user.save().then(result => {


      console.log("Message sent");
    }).catch(err => {
      console.log(err);
    });
    res.redirect('/')
  }




})


function getRandomString(length) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}



module.exports = router;
