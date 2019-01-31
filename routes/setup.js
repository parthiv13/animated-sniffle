const express = require('express'),
    logger = require('../config/winston'),
    bcrypt = require('bcrypt'),
    config = require('../config/database');
    dbName = "sendtodevice";
var router = express.Router();

const passport = require('passport'),
    MongoClient = require('mongodb').MongoClient;

router.get('/signup', function(req, res) {
    logger.info({ message: `${JSON.stringify(req.query)}`});
    bcrypt.hash(req.query.password, 8)
        .then((hash) => {
            MongoClient.connect(config.mongolocal, { useNewUrlParser: true })
                .then(client => {
                    client.db("sendtodevice").collection("Test").insertOne({ name: req.query.name, password: hash })
                        .then(data => {
                            console.log(data);
                            res.send(data);
                            client.close();
                        }).catch(err => {
                            console.log(err)
                            res.send(err)
                        });
                }).catch(err => {
                    console.log(err);
                 res.send(err);
                })
        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    //logger.info({ message: config.mongolocal });
});

router.get('/login', (req, res) => {
    passport.authenticate('local-login', (err, user, info) => {
        
    })
})

module.exports = router;