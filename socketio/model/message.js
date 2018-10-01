const { EventEmitter } = require('events')
const mongoose = require('../db-connector')
const schema = require('../schema/message')

const Message = mongoose.model('Message', schema)

let instance

class Model extends EventEmitter {
    constructor() {
        super()
        this.max = 50
    }

    push(msg) {
        let m = new Message(msg)
        this.emit('new-message', msg)
        return (
            new Promise((resolve, reject) => {
                m.save((err) => err? reject(err): resolve())
            })
            .then(() => Message.count())
            .then((count) => {
                if (count < this.max) {
                    return
                }
                return (
                    Message.find().sort({ 'time': 1 }).limit(1)
                    .then((res) => Message.findByIdAndRemove(res[0]._id))
                )
            })
        )
    }

    removeAll() {
        return new Promise((resolve, reject) => {
            Message.deleteMany({}, (err) => err? reject(err): resolve())
        })
    }

    get(cb) {
        return new Promise((resolve, reject) => {
            Message.find((err, msgs) => err? reject(err): resolve(msgs))
        })
    }

    setMax(max) {
        this.max = max
    }

    getMax() {
        return this.max
    }
}

module.exports = (() => {
    if (!instance) {
        instance = new Model()
    }
    return instance
})()
