var express = require('express');
var router = express.Router();
var md5 = require('md5')

var User = require('../model/user')
var jwt = require('../utils/jwt')
/* 登录 */
router.post('/login', function(req, res, next) {
  var {username,password} = req.body
  User.find({ username,password : md5(password)}).then(arr=>{
    if(arr.length == 0){
      res.json({
        err : 1 , 
        msg : '登录失败，请重试！'
      })
    }else{
      res.json({
        err : 0,
        msg : '登录成功',
        data : {
          token : jwt.createToken({username,password : md5(password)})
        }
        
      })
    }
  })
})

// 注册
router.post('/regist', function(req, res, next) {
  // console.log(req.body)
  var {username,password} = req.body
  User.insertMany([{username,password : md5(password)}]).then(()=>{
      res.json({
        err : 0,
        msg : '注册成功'
      })
      // saved!
  }).catch(()=>{
    res.json({
      err : 1,
      msg : '注册失败'
    })
  })
});

module.exports = router;
