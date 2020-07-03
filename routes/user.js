var express = require('express');
var router = express.Router();
var md5 = require('md5')
var jwt = require('../utils/jwt')

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
          username : username,
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

// 获取用户信息
router.get('/getInfo',function(req,res){
  var token = req.headers.authorization
  var data = jwt.verify(token)
  User.find({username:data.username}).then(arr=>{
    res.json({
      err : 0,
      msg : '获取成功',
      data : arr[0]
    })
  }).catch(()=>{
    res.json({
      err : 1,
      msg : '获取失败'
    })
  })
})

module.exports = router;
