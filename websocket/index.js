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
let clientList = []

let webSocketServer = require('websocket').server;
let http = require('http');
let server = http.createServer();

server.listen(webSocketsServerPort, function() {
    console.log("WebSocket Server is listening on port " + webSocketsServerPort);
});

let wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const sendMsg = function(data) {
         connection.sendUTF(JSON.stringify(data));
    }
    const broadcastMsg = function(data) {
        clientList.forEach(function(client) {
            client.sendUTF(JSON.stringify(data));
        });
    }

    let connection = request.accept(null, request.origin);
    clientList.push(connection)

    broadcastMsg({
        type: 'count',
        count: clientList.length
    })

    sendMsg({
        type: 'max-record',
        size: message.getMax()
    });

    connection.on('message', function(data) {
        let msg = JSON.parse(data.utf8Data)

        switch (msg.type) {
            case 'new-msg':
                if (Object.keys(msg).length < 2) {
                    return
                }
                message.push(msg)
                break
            case 'remove-all':
                message.removeAll()
                    .then(() => {
                        broadcastMsg({type: 'msg-clear'});
                    })
                    .catch(console.error)
                break
            default:
                console.log(`Action not handled: ${msg}`)
        }
    });

    message.on('new-message', (msg) => {
        sendMsg({
            type: 'msg',
            msg: msg
        })
    })

    message.get().then((msgs) => {
        sendMsg({
            type: 'chat-records',
            messages: msgs
        });
    })
    .catch(console.error)

    connection.on('close', function(connection) {
        clientList.splice(clientList.indexOf(connection), 1)
        broadcastMsg({
            type: 'count',
            count: clientList.length
        })
    });
});