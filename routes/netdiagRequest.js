const express = require('express');
const router = express.Router();
const ss = require('socket.io-stream');
const fs = require('fs');

module.exports = function (io) {

    var jsondata;
    var filename = 'real-time.log';
    var sendResponse = function () { };

    function logtoJSON() {
        var text = fs.readFileSync('real-time.log', 'utf8')
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
                    tempjson['date'] = e2;
                else if (i == 1)
                    tempjson['auth'] = e2;
                else if (i == 2)
                    tempjson['username'] = e2;
                else if (i == 3)
                    tempjson['browser'] = e2;
                else if (i == 4)
                    tempjson['ip'] = e2;
                else if (i == 5)
                    tempjson['bw'] = e2;
                i++;
            })
            json[c] = tempjson;
            c++
        });

        return json;
    }

    io.sockets.on("connection", function (socket) {
        // Everytime a client logs in, display a connected message
        console.log("Server-Client Connected!");

        socket.on('join', (room) => {
            console.log("joined" + room);
            socket.join(room);
        });

        ss(socket).on('netdiagResponse', stream => {
            //console.log(JSON.stringify(data) + "received from Netdiag.js");
            //sendResponse(data);
            stream.pipe(fs.createWriteStream(filename));
            stream.on('end', () => {
                console.log('file received');
                jsondata = logtoJSON();
                sendResponse(jsondata);
            })
        })
        
        ss(socket).on('netdiagResponseUpdate', stream => {
            //console.log(JSON.stringify(data) + "received from Netdiag.js");
            //sendResponse(data);
            stream.pipe(fs.createWriteStream(filename));
            stream.on('end', () => {
                console.log('file received');
                jsondata = logtoJSON();
                io.emit('netdiagDataUpdate',jsondata);
            })
        })
    });

    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'Netdiag routes'
        })
    });

    router.get('/real-time', async (req, res) => {
        io.to('netdiagjs').emit('netdiagRequest', req.body);

        sendResponse = function (data) {
            return res.status(200).json(data);
        }
    });

    return router;
};