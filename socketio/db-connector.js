const mongoose = require('mongoose')

const username = 'test'
const pwd = 'test123'
mongoose.connect(`mongodb://${username}:${pwd}@ds239911.mlab.com:39911/chat_demo`,
                    { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, "Connection error:"))
db.once('open', function() {
    console.log('DB connected!')
})

module.exports = mongoose.connection