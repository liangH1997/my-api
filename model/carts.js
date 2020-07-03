var mongoose = require('mongoose')

module.exports = mongoose.model('carts', mongoose.Schema({
                    username : String,
                    num : Number,
                    good_id : String,
                    good : Object
                }))
