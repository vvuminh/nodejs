const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
import {isNumeric, isEmail, isEmpty, isURL, toDate} from 'validator'
import User from '../models/User';

/* GET users listing. */
router.post('/api/login', (req, res) => {
  const user = { id: 3};
  const token = jwt.sign({user}, 'my_secret_key');
  res.json({
    token: token
  });
});

router.post('/register', async (req, res) => {
  let {name, password, email, profileURL, gender, dob} = req.body;
  if (isEmpty(name) || isEmpty(password)
    || !isEmail(email)
    || isEmpty(gender) || toDate(dob) === null){
      res.json({
        result: 'failed',
        data : {},
        message : 'name, password, gender must not be empty'
      });
      return ;
  }
  try {
    let newUser = await User.create({
      name,
      password,
      email,
      profileurl: profileURL,
      gender,
      dob,
    });
    if(newUser){
      res.json({
        result : 'ok',
        data : newUser,
        message : 'Insert a new user susseccfully'
      })
    }else {
      res.json({
        result: 'failed',
        data : {},
      })
    }
  } catch (error) {
    res.json({
      error : `${error}`
    })
  }
})

module.exports = router;
