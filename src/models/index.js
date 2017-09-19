import mongoose from 'mongoose'


mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/audivy', { useMongoClient: true })
mongoose.Promise = Promise

module.exports.User = require('./user')
