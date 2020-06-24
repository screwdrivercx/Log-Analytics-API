const ioClient = require('socket.io-client')
const ss = require('socket.io-stream')
const fs = require('fs')

function createResponse(socket) {
    var filename = '2020-05-08.log';
    var stream = ss.createStream();
    stream.on('end', () => {
        console.log('file sent');
    })
    ss(socket).emit('netdiagResponse', stream);
    fs.createReadStream(filename).pipe(stream);
    setTimeout(function () { createResponseUpdate(socket) }, 10000);
}

function createResponseUpdate(socket) {
    var filename = '2020-05-08.log';
    var stream = ss.createStream();
    stream.on('end', () => {
        console.log('file sent');
    })
    ss(socket).emit('netdiagResponseUpdate', stream);
    fs.createReadStream(filename).pipe(stream);
    //setTimeout(function () { createResponse(socket) }, 1000);
}

var socket = ioClient.connect("http://localhost:4002");
socket.emit('join','netdiagjs');

socket.on('netdiagRequest', (req) => {
    console.log("received request " + req);
    createResponse(socket);
})

//please create a function that will trigger when log file is updated
function onUpdate(){
    //do something here
    
    createResponseUpdate();
}