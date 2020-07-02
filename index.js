const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const netdiagRequest = require('./routes/netdiagRequest')(io);
const radlogRequest = require('./routes/radlogRequest')(io);

app.use(cors())
app.use(express.json());
app.use('/api/netdiagRequest', netdiagRequest);
app.use('/api/radlogRequest', radlogRequest);

app.get('/', (req, res) => {
    res.status(200).send({
      message: 'Log Analytics API routes'
    })
});

server.listen(4002);