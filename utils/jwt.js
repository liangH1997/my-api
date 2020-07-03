var jwt = require('jsonwebtoken')

// 加密
function createToken(data){
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: data
      }, "myApi")
}

// 解密
function verify(token){
    return jwt.verify(token, 'myApi', function(err, decoded) {
        // console.log(decoded.data) // bar
        return decoded.data
      });
}



module.exports={
    createToken,
    verify
}