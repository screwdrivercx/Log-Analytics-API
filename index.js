const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const netdiagRequest = require('./routes/netdiagRequest')(io);
const radlogRequest = require('./routes/radlogRequest')(io);

app.use(fileUpload({
  createParentPath: true
}));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/netdiagRequest', netdiagRequest);
app.use('/api/radlogRequest', radlogRequest);

app.get('/', (req, res) => {
    res.status(200).send({
      message: 'Log Analytics API routes'
    })
});

server.listen(4002);