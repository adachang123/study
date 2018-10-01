const { EventEmitter } = require('events')
const mongoose = require('./db-connector')
const schema = require('./schema')

const Message = mongoose.model('Message', schema)

let instance
let MAX = 50

class Records extends EventEmitter {
    constructor() {
        super()
    }

    push(msg) {
        const m = new Message(msg)
        m.save()

        Message.count().then((count) => {
            if (count >= MAX) {
                Message.find().sort({'time': 1}).limit(1).then((res) => {
                    Message.findByIdAndRemove(res[0]._id)
                })
            }
        })
        this.emit('new_message', msg)
    }

    removeAll(cb) {
        Message.deleteMany({}, cb);
    }

    get(cb) {
        Message.find((err, msgs) => {
            cb(msgs)
        })
    }

    setMax(max) {
        MAX = max
    }

    getMax() {
        return MAX
    }
}

module.exports = (function() {
    if (!instance) {
        instance = new Records()
    }
    return instance
})()