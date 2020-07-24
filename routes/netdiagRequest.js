const express = require('express');
const router = express.Router();
const fs = require('fs');

module.exports = function () {

    function logtoJSON(filename) {
        var text = fs.readFileSync(filename, 'utf8')
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
                    tempjson['time'] = e2;
                else if (i == 1)
                    tempjson['userStatus'] = e2;
                else if (i == 2)
                    tempjson['userID'] = e2;
                else if (i == 3)
                    tempjson['platform'] = e2;
                else if (i == 4)
                    tempjson['IPaddress'] = e2;
                else if (i == 5)
                    tempjson['speed'] = e2;
                i++;
            })
            json[c] = tempjson;
            c++
        });

        return json;
    }

    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'Netdiag routes'
        })
    });

    router.get('/real-time', async (req, res) => {
        filename = 'real-time.log';
        console.log("received request for real-time.log");

        const file = './netdiag-logs/real-time.log';
        res.download(file, (err)=>{
            if(res.headersSent){
                console.log('header sent');
            } else {
                res.status(404).send('No such file or directory for '+filename);
            }
        });
    });

    router.get('/:year/:month/:date', (req, res) => {
        filename = req.params.year + '-' + req.params.month + '-' + req.params.date + '.log';
        console.log("received request for " + filename);

        const file = './netdiag-logs/'+filename;
        res.download(file, (err)=>{
            if(res.headersSent){
                console.log('header sent');
            } else {
                res.status(404).send('No such file or directory for '+filename);
            }
        });
    });

    router.post('/upload', async (req, res) => {
        try{
            if(!req.files){
                res.send({
                    status: false,
                    message: 'No file Uploaded'
                });
            } else {
                let logfile = req.files.logfile;

                logfile.mv('./netdiag-logs/'+logfile.name);

                res.send({
                    status: true,
                    message: 'File is Uploaded',
                    data: {
                        name: logfile.name,
                        size: logfile.size
                    }
                });
            }
        } catch(err){
            res.status(500).send(err);
        }
    })

    return router;
};