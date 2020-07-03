var mongoose = require('mongoose')

module.exports = mongoose.model('banners', mongoose.Schema({
                    title : String,
                    img : String,
                    qfAd : String
                }))
