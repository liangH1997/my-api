var mongoose = require('mongoose')

module.exports = mongoose.model('user', mongoose.Schema({
                    username: String,
                    password: String
                }))
