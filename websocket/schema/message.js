const { Schema } = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
})
