const express = require('express')
const path = require('path')
const app = express()
const message = require('./model/message')

const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'view')))

let onlineCount = 0;

io.on('connection', (socket) => {
    onlineCount++
    console.log(`New connection, connected: ${onlineCount}`)

    io.emit('online', onlineCount)
    socket.emit('max-record', message.getMax())

    message.get()
    .then((msgs) => socket.emit('chat-records', msgs))
    .catch(console.error)

    socket.on('disconnect', () => {
        onlineCount--
        console.log(`Close connection, connected: ${onlineCount}`)
        io.emit('online', onlineCount)
    })

    socket.on('send', (msg) => {
        console.log(msg)
        if (Object.keys(msg).length < 2) {
            return
        }
        message.push(msg)
    })

    socket.on('remove-all', () => {
        console.log("Remove all data!!!")
        message.removeAll()
        .then(() => io.emit('msg-clear'))
        .catch(console.error)
    })
})

message.on('new-message', (msg) => io.emit('msg', msg))

server.listen(3000, () => {
    console.log("Server started to listen port 3000")
})
