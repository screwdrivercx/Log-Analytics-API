const express = require('express');
const router = express.Router();

module.exports = function(io) {

    //we define the variables
    var sendResponse = function () {};
    var sessionID;

    io.sockets.on("connection",function(socket){
        // Everytime a client logs in, display a connected message
        console.log("Server-Client Connected!");

        sessionID = sessionID == null ? socket.id : sessionID;

        socket.on('connected', function(data) {
            //listen to event at anytime (not only when endpoint is called)
            //execute some code here
        });

        socket.on('netdiagResponse', data => {
            //calling a function which is inside the router so we can send a res back
            console.log(JSON.stringify(data) + "received from Netdiag.js");
            sendResponse(data);
        })     
    });

    router.get('/', (req, res) => {
        res.status(200).send({
          message: 'Netdiag routes'
        })
    });

    router.get('/real-time', async (req, res) => {
        console.log(sessionID);
        io.to(sessionID).emit('netdiagRequest', req.body);

        sendResponse = function (data) {
                return res.status(200).json(data);
        }
    });

    return router;
};