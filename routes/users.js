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
    },{
      fields : ["name", "password", "email", "profileurl", "gender", "dob"]
    });
    if(newUser){
      const token = jwt.sign({newUser}, 'my_secret_key');
      res.json({
        result : 'ok',
        data : newUser,
        token : token,
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

router.post('/login', async (req, res) => {
  let {name, password} = req.body;
  if(isEmpty(name) || isEmpty(password)){
    res.json({
      result : "false",
      message : "nhap lai username or password"
    });
    return ;
  }
  try {
    let users = await User.findAll({
      attributes: ['id', 'name', 'password', 'email', 'profileurl', 'gender', 'dob'],
      where: {
        name,
        password
      }
  });
  if(users.length > 0) {
    const token = jwt.sign({users}, 'my_secret_key');
    res.json({
        result: 'ok',
        data: users,
        token : token,
        message: "login successfully"
    });
} else {
    res.json({
        result: 'failed',
        data: {},
        message: "user chua ton tai"
    });
}
  } catch (error) {
    res.json({
      result : "dang nhap that bai",
      error : `${error}`
    })
  }
})

module.exports = router;
