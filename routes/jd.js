var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Good = require('../model/good')
var Cate = require('../model/cates')
var Cart = require('../model/carts')
var jwt = require('../utils/jwt')

var User = require('../model/user')
var Banner = require('../model/banner')

/* 添加商品*/   //修改商品信息
router.post('/addGood', function(req, res, next) {
  var {img,name,desc,price,cate,hot,id}=req.body
  for(var key in req.body){
    // console.log(req.body[key])
    if(!req.body[key]){
      return res.json({
        err : 1,
        msg : '信息不全，请重试！'
      }) 
    }
  }
  var item = {
    img: img,
    name: name,
    desc: desc,
    price: price,
    cate: cate,
    hot : hot,
    create_time : Date.now()
  }
  if(id){
    Good.updateOne({_id:id},item).then(()=>{
      res.json({
        err : 0,
        msg : '修改成功'
      })
    }).catch(()=>{
      res.json({
        err : 1,
        msg : '修改失败'
      })
    })
  }else{
    Good.insertMany([item]).then(()=>{
      res.json({
        err : 0,
        msg : '添加成功'
      });
    })
  }
});

// 获取首页推荐商品
router.get('/getHotGoodList', function(req, res, next) {
  // console.log(req.query)
  var {hot,page,size,cate} = req.query
  if(!page) return res.json({err:1,msg:'page为必填项'})
  page = parseInt(page)
  size = parseInt(size?size:10)
  hot = hot?hot:false
  if(cate){
    Good.find({cate}).then(arr=>{
      res.json({
        err : 0,
        msg : '筛选成功',
        data : arr
      });
    })
  }else{
    if(hot == true){
      Good.find({hot:true}).skip((page-1)*size).limit(size).then(arr=>{
        res.json({
          err : 0 ,
          msg : '获取成功',
          data : arr
        })
      })
    }else{
      Good.find().skip((page-1)*size).limit(size).then(arr=>{
        res.json({
          err : 0 ,
          msg : '获取成功',
          data : arr
        })
      })
    }
  }
});

// 获取全部品类
router.get('/getAllCates', function(req, res, next) {
  Cate.find().then(arr=>{
    res.json({
      err : 0,
      msg : '获取成功',
      data : arr
    });
  })
});

// 基于品类筛选
router.get('/getCateGoodList', function(req, res, next) {
  var {cate} = req.query
  Good.find({cate}).then(arr=>{
    res.json({
      err : 0,
      msg : '筛选成功',
      data : arr
    });
  })
});

// 获取商品详情
router.get('/getGoodDetail', function(req, res, next) {
  var {good_id} = req.query
  Good.find({_id:good_id}).then(arr=>{
    res.json({
      err : 0,
      msg : '获取成功',
      data : arr[0]
    });
  }).catch(()=>{
    res.json({
      err : 1,
      msg : '获取失败'
    })
  })
});

// 添加到购物车
router.post('/addToCart', function(req, res, next) {
  var token = req.headers.authorization
  // console.log(token)
  var {good_id} = req.body
  num = 1
  var data = jwt.verify(token)
  // console.log(data.username)
  User.find(data).then(arr=>{
    // console.log(arr)
    if(arr.length==1){
      Cart.find({good_id}).then((arr)=>{
        Cart.updateOne({good_id},{num : arr[0].num+1}).then(()=>{
          res.json({
            err : 0,
            msg : '添加成功'
          })
        })
      }).catch(()=>{
        Good.find({_id : good_id}).then(arr=>{
          Cart.insertMany([{username : data.username,num,good_id,good : arr[0]}]).then(()=>{
            res.json({
              err : 0,
              msg : '添加成功'
            })
          })
        })
      })
    }else{
      res.json({
        err : 1,
        msg : 'token无效，请重新登录'
      })
    }
  })
});

// 获取购物车列表
router.get('/getCartList', function(req, res, next) {
  var token = req.headers.authorization
  var data = jwt.verify(token)
  // console.log(data)
  if(!data){
    return res.json({
              err : 1,
              msg : 'token无效，请重新登录'
            })
  }
  User.find(data).then(arr=>{
    // console.log(arr)
    if(arr.length>=1){
      Cart.find({username:data.username}).then(arr=>{
        res.json({
          err : 0,
          msg : '获取成功',
          data : arr
        });
      })
    }else{
      res.json({
        err : 1,
        msg : '获取失败'
      })
    }
  }).catch(()=>{
    res.json({
      err : 1,
      msg : 'token无效，请重新登录'
    })
  })
})

// 更改购物车商品数量
router.post('/updateCartNum', function(req, res, next) {
  var {num,id} = req.body
  console.log(num,id)
  Cart.updateOne({good_id:id}, {num}).then(()=>{
    res.json({
      err : 0,
      msg : '修改成功'
    });
  }).catch(()=>{
    res.json({
      err : 1,
      msg : '修改失败'
    });
  })
});

// 删除购物车商品
router.get('/deleteToCart', function(req, res, next) {
  var {id} = req.query

  Cart.deleteOne({good_id : id}).then(()=>{
    res.json({
      err : 0,
      msg : '删除成功'
    });
  }).catch(()=>{
    res.json({
      err : 1,
      msg : '删除失败'
    });
  })
  
});

// 提交购物
router.get('/submitToCart', function(req, res, next) {
  res.json({
    err : 0,
    msg : '提交成功'
  });
});


// 添加banner
router.post('/ad', function(req, res, next) {
  var {img,title,qfAd} = req.body
  console.log(img)
  Banner.insertMany([{img,title,qfAd}]).then(()=>{
    res.json({
      err : 0 ,
      msg : '添加成功'
    })
  }).catch(()=>{
    res.json({
      err : 1,
      msg : '添加失败'
    })
  })
});

// 获取banner
router.get('/getAd', function(req, res, next) {
  Banner.find().then(arr=>{
    res.json({
      err : 0,
      msg : '获取成功',
      data : arr
    })
  })
});

// 删除商品
router.get('/delGood', function(req, res, next) {
  var {id} = req.query
  Good.deleteOne({_id:id}).then(()=>{
    res.json({
      err : 0,
      msg : '删除成功'
    })
  })
});
module.exports = router;
