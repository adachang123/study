const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html')
})

app.get('/app.js', (req, res) => {
    res.sendFile(__dirname + '/view/app.js')
})

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/view/style.css')
})

let onlineCount = 0;

io.on('connection', (socket) => {
    onlineCount++;
    console.log("New connection, connected: " + onlineCount)
    io.emit('online', onlineCount)

    socket.on('disconnect', () => {
        onlineCount--;
        io.emit('online', onlineCount)
        console.log("Close connection, connected: " + onlineCount)
    })

    socket.on('send', (msg) => {
        console.log(msg)
        io.emit('msg', msg)
    })
})

server.listen(3000, () => {
    console.log("Server started to listen port 3000")
})