const mongoose = require('mongoose')
const {urlDB} = require('../config')

mongoose.set('strictQuery', false)
mongoose.connect(urlDB, {
    useUnifiedTopology: true,
    useNewUrlParser:true
})

const db = mongoose.connection

module.exports = db