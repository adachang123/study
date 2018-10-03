const express = require('express')
const path = require('path')
const app = express()
const message = require('./model/message')

/* Express server */
let appPort = process.env.PORT || 3000

app.listen(appPort, () => {
    console.log(`App listening on port ${appPort}`)
})
app.use(express.static(path.join(__dirname, 'view')))

/* Web Socket server */
let webSocketsServerPort = 1337

let WebSocketServer = require('websocket').server;
let http = require('http');
let server = http.createServer();

server.listen(webSocketsServerPort, () => {
    console.log(`WebSocket Server is listening on port ${webSocketsServerPort}`)
})

class WSServer extends WebSocketServer {
    constructor(opts) {
        super(opts)
        this.clientList = []
    }
    send(conn, type, data) {
        conn.sendUTF(JSON.stringify({
            type: type,
            data: data
        }))
    }
    broadcast(type, data) {
        this.clientList.forEach((conn) => this.send(conn, type, data))
    }
    init(conn) {
        this.addClient(conn)
        conn.on('message', (data) => {
            let msg
            try {
                msg = JSON.parse(data.utf8Data)
              } catch (e) {
                console.error(`BadMsg ${data.utf8Data}`)
                return
            }

            conn.emit(msg.type, msg.data)
        })
        conn.on('close', () => {
            this.removeClient(conn)
            conn.emit('disconnect')
        })
    }
    addClient(conn) {
        this.clientList.push(conn)
    }
    removeClient(conn) {
        this.clientList.splice(this.clientList.indexOf(conn), 1)
    }
    countClient() {
        return this.clientList.length
    }
}

let wsServer = new WSServer({
    httpServer: server
})

message.on('new-message', (msg) => wsServer.broadcast('msg', msg))

wsServer.on('request', function(request) {
    let conn = request.accept(null, request.origin)
    this.init(conn)

    conn.on('new-msg', (msg) => {
        if (Object.keys(msg).length < 2) {
            return
        }
        message.push(msg)
    })

    conn.on('remove-all', (msg) => {
        message.removeAll()
            .then(() => this.broadcast('msg-clear'))
            .catch(console.error)
    })

    this.send(conn, 'max-record', message.getMax())

    message.get().then((msgs) => {
        this.send(conn, 'chat-records', msgs)
    })
    .catch(console.error)

    this.broadcast('count', this.countClient())
    conn.on('disconnect', () => this.broadcast('count', this.countClient()))
}.bind(wsServer))
