const express = require('express');
const router = express.Router();
const ss = require('socket.io-stream');
const fs = require('fs');
const { connected } = require('process');
const { json } = require('express');

module.exports = function (io) {

    var jsondata;
    var sendResponse = function () { };

    function logtoJSON(filename) {
        var text = fs.readFileSync(filename, 'utf8')
        array = text.split("\n");
        var dataArray = [];

        for (var i = 0; i < array.length; i++) {
            if (array[i] == '') { continue }
            let tempArray = [];
            tempArray = array[i].split(",");
            dataArray.push(tempArray)
        }

        var json = {};
        var c = 1;
        dataArray.forEach((e1) => {
            var tempjson = {};
            var i = 0;
            e1.forEach((e2) => {
                if (i == 0)
                    tempjson['time'] = e2;
                else if (i == 1)
                    tempjson['userStatus'] = e2;
                else if (i == 2)
                    tempjson['userID'] = e2;
                else if (i == 3)
                    tempjson['platform'] = e2;
                else if (i == 4)
                    tempjson['IPaddress'] = e2;
                else if (i == 5)
                    tempjson['speed'] = e2;
                i++;
            })
            json[c] = tempjson;
            c++
        });

        return json;
    }

    io.sockets.on("connection", function (socket) {
        var connected = false;
        // Everytime a client logs in, display a connected message
        console.log("Server-Client Connected!");

        socket.on('join', (room) => { //for netdiag.js
            console.log("joined" + room);
            socket.join(room);
        });

        ss(socket).on('netdiagResponseRealtime', stream => { //for client
            filename = 'netdiag-real-time.log'
            if (stream != null) {
                stream.pipe(fs.createWriteStream(filename));
                stream.on('end', () => {
                    console.log('file received');
                    jsondata = logtoJSON(filename);
                    if (!connected) { //handshaking
                        console.log('handshaking success');
                        sendResponse(jsondata);
                        connected = true;
                    }
                    else { //connected
                        console.log("Update")
                        socket.emit('netdiagDataUpdate', jsondata);
                    }
                })
            } else {
                sendErrResponse({ error: 'No Such File or Directory for ' + filename});
            }

        })

        ss(socket).on('netdiagResponse', data => { //for client
            filename = "log-"+data.filename;
            console.log(filename);
            if (data.stream != null) {
                data.stream.pipe(fs.createWriteStream(filename));
                data.stream.on('end', () => {
                    console.log('file received');
                    jsondata = logtoJSON(filename);
                    sendResponse(jsondata);
                })
            } else {
                sendErrResponse({ error: 'No Such File or Directory for ' + filename });
            }
        })
    });

    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'Netdiag routes'
        })
    });

    router.get('/real-time', async (req, res) => {
        io.to('netdiagjs').emit('netdiagRequestRealtime', req.body);

        sendResponse = function (data) {
            return res.status(200).json(data);
        }

        sendErrResponse = function (data) {
            return res.status(404).json(data);
        }
    });

    router.get('/:year/:month/:date', (req, res) => {
        io.to('netdiagjs').emit('netdiagRequest', req.params)
        var sent = false;
        sendResponse = function (data) {
            if(!sent){
                sent = true;
                return res.status(200).json(data);
            }
        }

        sendErrResponse = function (data) {
            sent = true;
            return res.status(404).json(data);
        }
    })

    return router;
};