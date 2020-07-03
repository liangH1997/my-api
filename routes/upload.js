var express = require('express');
var router = express.Router();
var multiparty = require('multiparty')


var User = require('../model/user')

// 注册
router.post('/img', function(req, res, next) {
  // console.log(req.body)
  var form = new multiparty.Form();
 
  form.parse(req, function(err, fields, files) {
    if(err){
        res.json({
            err : 0,
            msg : '上传失败'
        })
        console.log('fields',fields)
        console.log('files',files)
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });

});

module.exports = router;
