const express = require('express'),
    logger = require('../config/winston'),
    config = require('../config/database');
    dbName = "sendtodevice";
var router = express.Router();

const passport = require('passport'),
    MongoClient = require('mongodb').MongoClient;
    client = new MongoClient(config.url, { useNewUrlParser: true });

router.get('/signup', function(req, res) {
    //logger.info({ message: `${JSON.stringify(req.body)}`});
    client.connect( (err, db) => {
        if(err) {
            logger.debug({ message: "ok?"})
            return res.send(err);
        }
        logger.info({ message: 'whaaaaaaaat?'});
        console.log(db)
        const col = db.collection('Test');

        col.find({}).toArray((err, docs) => {
            if(err) return res.send(err);
            logger.info({ message: docs });
            client.close();
        })
    });
});

module.exports = router;