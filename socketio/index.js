const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html')
})

io.on('connection', (socket) => {
    console.log("Hello client")
    socket.on('disconnect', () => {
        console.log("Bye~ client")
    })
    socket.on('greet', () => {
        socket.emit("greet", "Hi~ Client")
    })
})

server.listen(3000, () => {
    console.log("Server started to listen port 3000")
})