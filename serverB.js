const ioClient = require('socket.io-client')
const ss = require('socket.io-stream')
const fs = require('fs')

function createResponseRealtime(socket, filename) {
    var stream = ss.createStream();
    stream.on('end', () => {
        console.log('file sent');
    })
    ss(socket).emit('netdiagResponseRealtime', stream);
    fs.createReadStream(filename).pipe(stream);
}

function createResponse(socket, filename) {
    if (fs.existsSync(filename)) {
        var stream = ss.createStream();
        stream.on('end', () => {
            console.log('file sent');
        })
        ss(socket).emit('netdiagResponse', { stream: stream, filename: filename });
        rs = fs.createReadStream(filename).pipe(stream);
    }
    else{
        ss(socket).emit('netdiagResponse', { stream: stream, filename: filename });
    }
}

var socket = ioClient.connect("http://localhost:4002");
socket.emit('join', 'netdiagjs');

socket.on('netdiagRequestRealtime', (req) => {
    filename = 'current.log'
    console.log("received request for Real-time log");
    //***change this setInterval to onUpdate() to provide realtime log data
    setInterval(() => createResponseRealtime(socket, filename), 10000);
})

socket.on('netdiagRequest', (req) => {
    filename = req.year + '-' + req.month + '-' + req.date + '.log';
    console.log("received request for " + filename);
    createResponse(socket, filename);
})


//***please create a function that will trigger when log file is updated
function onUpdate() {
    //do something here
    filename = 'current.log'
    createResponseRealtime(socket, filename);
}