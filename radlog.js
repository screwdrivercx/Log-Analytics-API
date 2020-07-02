const ioClient = require('socket.io-client')
const ss = require('socket.io-stream')
const fs = require('fs')

function createResponseRealtime(socket, filename) {
    if (fs.existsSync(filename)) {
        var stream = ss.createStream();
        stream.on('end', () => {
            console.log('file sent');
        })
        ss(socket).emit('radlogResponseRealtime', stream);
        fs.createReadStream(filename).pipe(stream);
    }
    else {
        ss(socket).emit('radlogResponseRealtime', stream);
    }

}

function createResponse(socket, filename) {
    if (fs.existsSync(filename)) {
        var stream = ss.createStream();
        stream.on('end', () => {
            console.log('file sent');
        })
        ss(socket).emit('radlogResponse', { stream: stream, filename: filename });
        rs = fs.createReadStream(filename).pipe(stream);
    }
    else {
        ss(socket).emit('radlogResponse', { stream: stream, filename: filename });
    }
}

var socket = ioClient.connect("http://localhost:4002");
socket.emit('join', 'radlogjs');

socket.on('radlogRequestRealtime', (req) => {
    filename = 'auth-detail-current';
    console.log("received request for Real-time log");
    //***change this setInterval to onUpdate() to provide realtime log data
    createResponseRealtime(socket, filename)
    setInterval(() => createResponseRealtime(socket, filename), 30000);
})

socket.on('radlogRequest', (req) => {
    filename = 'auth-detail-' + req.year + req.month + req.date;
    console.log("received request for " + filename);
    createResponse(socket, filename);
})


//***please create a function that will trigger when log file is updated
function onUpdate() {
    //do something here
    filename = 'current.log'
    createResponseRealtime(socket, filename);
}