require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2x12xkp.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

const user = require('./models/user.js');

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

// app.use('/', (req, res, next) => {
//   try {
//     if (req.path == '/login' || req.path == '/register' || req.path == '/') {
//       next();
//     } else {
//       jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
//         if (decoded && decoded.user) {
//           req.user = decoded;
//           next();
//         } else {
//           return res.status(401).json({
//             errorMessage: 'User unauthorized!',
//             status: false,
//           });
//         }
//       });
//     }
//   } catch (e) {
//     res.status(400).json({
//       errorMessage: 'Something went wrong!',
//       status: false,
//     });
//   }
// });

app.get('/', (req, res) => {
  res.status(200).json({
    title: 'jawa-api',
  });
});

app.post('/login', (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {
          console.log(
            'password =',
            data[0].password,
            ', request body =',
            req.body.password,
            ', are they equal?',
            req.body.password === data[0].password,
          );
          if (data[0].password === req.body.password) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {
            res.status(401).json({
              errorMessage: 'Username or password is incorrect!',
              status: false,
            });
          }
        } else {
          res.status(400).json({
            errorMessage: 'User database is empty',
            status: false,
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

app.post('/register', (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length == 0) {
          let User = new user({
            username: req.body.username,
            password: req.body.password,
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false,
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.',
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false,
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign(
    { user: data.username, id: data._id },
    'shhhhh11111',
    { expiresIn: '1d' },
    (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: 'Login Successfully.',
          token: token,
          status: true,
        });
      }
    },
  );
}

app.listen(2000, () => {
  console.log('API server running on port 2000');
});
