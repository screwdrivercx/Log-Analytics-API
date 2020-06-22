const ioClient = require('socket.io-client')

function createResponse(socket) {
    socket.emit('netdiagResponse', { my: 'data' });
    //setTimeout(function () { createResponse(socket) }, 1000);
}

var socket = ioClient.connect("http://localhost:4002");

socket.on('connection', () => {
    const sessionID = socket.sessionid;
})

socket.on('netdiagRequest', (req) => {
    console.log(req);
    createResponse(socket);
})