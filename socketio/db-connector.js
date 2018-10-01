const mongoose = require('mongoose')

const username = 'test'
const pwd = 'test123'

mongoose.connect(
    `mongodb://${username}:${pwd}@ds239911.mlab.com:39911/chat_demo`,
    { useNewUrlParser: true }
)

const db = mongoose.connection

db.on('error', (err) => console.error("Connection error:", err))
db.once('open', () => console.log('DB connected!'))

module.exports = mongoose.connection
