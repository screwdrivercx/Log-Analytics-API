const express = require('express');
const router = express.Router();

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'radlog routes'
        })
    });

    router.get('/real-time', async (req, res) => {
        filename = 'real-time';
        console.log("received request for real-time radius log");

        const file = './radius-logs/real-time';
        res.download(file, (err)=>{
            if(res.headersSent){
                console.log('header sent');
            } else {
                res.status(404).send('No such file or directory for '+filename);
            }
        });
    });

    router.get('/:year/:month/:date', (req, res) => {
        filename = 'auth-detail-'+req.params.year + req.params.month + req.params.date;
        console.log("received request for " + filename);

        const file = './radius-logs/'+filename;
        res.download(file, (err)=>{
            if(res.headersSent){
                console.log('header sent');
            } else {
                res.status(404).send('No such file or directory for '+filename);
            }
        });
    })

    
    router.post('/upload', async (req, res) => {
        try{
            if(!req.files){
                res.send({
                    status: false,
                    message: 'No file Uploaded'
                });
            } else {
                let logfile = req.files.logfile;

                logfile.mv('./radius-logs/'+logfile.name);

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