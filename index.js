var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
io.on('connection', function(socket){
    console.log('Client connection received');

    socket.emit('sendToClient', { hello: 'world' });

    socket.on('receivedFromClient', (data) => {
        console.log(data);
    });
});

app.get('/netdiag', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/netdiag-chunk', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/radiuslog', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/radiuslog-chunk', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
 
http.listen(3000, function(){
    console.log('HTTP server started on port 3000');
});