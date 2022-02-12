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
    .isLength({ min: 3, max: 250 }),
  check('link', 'Link length should be 3 to 250 characters')
    .isLength({ min: 3, max: 250 }),
  check('type', 'Select resource type')
    .isLength({ min: 3, max: 250 }),

]
// Uncomment and register for api creds.

// router.post("/register", async (req, res) => {
//   try {
//     // Get user input
//     const { first_name, last_name, email, password } = req.body;
//     console.log(req.body.first_name);
//     console.log(email);
//     // // Validate user input
//     // if (!(email && password && first_name && last_name)) {
//     //   res.status(400).send("All input is required");
//     // }

//     // check if user already exist
//     // Validate if user exist in our database

//     const oldUser = await Api.findOne({ email });

//     if (oldUser) {
//       return res.status(409).send("User Already Exist. Please Login");
//     }

//     //Encrypt user password
//     encryptedPassword = await bcrypt.hash(password, 10);

//     // Create user in our database
//     const api = await Api.create({
//       first_name,
//       last_name,
//       email: email.toLowerCase(), // sanitize: convert email to lowercase
//       password: encryptedPassword,
//     });

//     // Create token
//     const token = jwt.sign(
//       { api_user_id: api._id, email },
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "2h",
//       }
//     );
//     // save user token
//     api.token = token;

//     // return new user
//     res.status(201).json(api);
//   } catch (err) {
//     console.log(err);
//   }
//   // Our register logic ends here
// });


/* GET home page. */
router.get('/', (req, res) => {
  let user_token = req.cookies['x-access-token'];

  if (user_token) {
    axios.get(process.env.API_URL + '/data', {
      headers: {
        'x-access-token': user_token
      }
    })
      .then(response => {
        res.render('index', { title: 'Membership Form', Key: process.env.PAY_KEY_ID });
        // res.send(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    res.redirect('/login')
  }

});
router.get('/data', auth, (req, res) => {
  // get data from activation
  User.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});





// Login
router.post("/admin", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const api = await Api.findOne({ email });

    if (api && (await bcrypt.compare(password, api.password))) {
      // Create token
      const token = jwt.sign(
        { api_id: api._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      api.token = token;
      cookietoken = api.token
      let user_token = req.cookies['x-access-token']; // always empty

      if (user_token) {

        res.redirect('/');
      } else {



        res.cookie('x-access-token', cookietoken, { maxAge: 60000 * 60 * 1.5 });
        res.redirect('/');
      }
      // res.location('/dashboard')

      // res.status(302).end()

    }
    else {
      res.status(400).send("Invalid Credentials");
    }

  } catch (err) {
    console.log(err);
  }
});
router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const api = await Api.findOne({ email });

    if (api && (await bcrypt.compare(password, api.password))) {
      // Create token
      const token = jwt.sign(
        { api_id: api._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      api.token = token;

      // user
      res.status(200).json(api);
    }
    else {
      res.status(400).send("Invalid Credentials");
    }

  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
router.get("/login", async (req, res) => {
  let user_token = req.cookies['x-access-token'];

  if (user_token) {
    res.redirect('/');
  } else {
    res.status(200).render('login');
  }


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
