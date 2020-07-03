var mongoose = require('mongoose')

module.exports = mongoose.model('goodlist', mongoose.Schema({
                    img: String,
                    name: String,
                    desc: String,
                    price: Number,
                    cate: String,
                    hot : Boolean,
                    create_time : Number
                }))
