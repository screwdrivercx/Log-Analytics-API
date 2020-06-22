const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const netdiagRequest = require('./routes/netdiagRequest')(io);

app.use(cors())
app.use(express.json());
app.use('/api/netdiagRequest', netdiagRequest);

app.get('/', (req, res) => {
    res.status(200).send({
      message: 'Log Analytics API routes'
    })
});

server.listen(4002);