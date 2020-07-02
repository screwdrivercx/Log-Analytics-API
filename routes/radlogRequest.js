const express = require('express');
const router = express.Router();
const ss = require('socket.io-stream');
const fs = require('fs');
const { connected } = require('process');
const { json } = require('express');

module.exports = function (io) {

    var sendResponse = function () { };

    io.sockets.on("connection", function (socket) {
        var connected = false;
        // Everytime a client logs in, display a connected message
        console.log("Server-Client Connected!");

        socket.on('join', (room) => { //for radiuslog.js
            console.log("joined" + room);
            socket.join(room);
        });

        ss(socket).on('radlogResponseRealtime', stream => { //for client
            filename = 'radlog-real-time.log'
            if (stream != null) {
                stream.pipe(fs.createWriteStream(filename));
                stream.on('end', () => {
                    console.log('file received');
                    if (!connected) { //handshaking
                        console.log('handshaking success');
                        sendResponse(filename);
                        connected = true;
                    }
                    else { //connected
                        console.log("Update")
                        socket.emit('radlogDataUpdate', jsondata);
                    }
                })
            } else {
                sendErrResponse({ error: 'No Such File or Directory for ' + filename });
            }

        })

        ss(socket).on('radlogResponse', data => { //for client
            console.log(data.filename);
            if (data.stream != null) {
                data.stream.pipe(fs.createWriteStream(data.filename));
                data.stream.on('end', () => {
                    console.log('file received');
                    sendResponse(data.filename);
                })
            } else {
                sendErrResponse({ error: 'No Such File or Directory for ' + data.filename });
            }
        })
    });

    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'radlog routes'
        })
    });

    router.get('/real-time', async (req, res) => {
        io.to('radlogjs').emit('radlogRequestRealtime', req.body);

        sendResponse = function (filename) {
            return res.download('./' + filename);
        }

        sendErrResponse = function (filename) {
            return res.status(404).json(filename);
        }
    });

    router.get('/:year/:month/:date', (req, res) => {
        io.to('radlogjs').emit('radlogRequest', req.params)

        sendResponse = function (filename) {
            return res.download('./' + filename, filename);
        }

        sendErrResponse = function (filename) {
            return res.status(404).json(filename);
        }
    })

    return router;
};