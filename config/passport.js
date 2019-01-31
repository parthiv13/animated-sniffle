const LocalStrategy =  require('passport-local').Strategy;
const logger = require('./winston');
const users = require('../database/user');
const MongoClient = require('mongodb').MongoClient;
const databaseURL = require('../config/database').mongolocal;
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        console.log('inside serialise callback');
        logger.debug({message: `${JSON.stringify(user)}`});
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        logger.info({message: 'deserializing user'});
        logger.debug({message: `${JSON.stringify(users[0])}`})
        MongoClient.connect(databaseURL, {useNewUrlParser: true})
        .then(client => {
            client.db("sendtodevice").collection("test").findOne({ _id: id})
            .then(user => {
                done(null, user);
            }).catch(err => {
                console.log(err);
            })
        })
    });

    passport.use('local-login', new LocalStrategy(
        { passReqToCallback : true },
        (req, name, password, done) => {
            logger.info( {message: 'Local Strategy'});
            logger.debug({message: `${JSON.stringify(users[0])}`})
            const user = users[0];
            MongoClient.connect(databaseURL, {useNewUrlParser: true})
                .then(client => {
                    client.db("sendtodevice").collection("test").findOne({ name: req.query.uname })
                    .then(data => {
                        bcrypt.compare(req.query.password, data[0].password)
                        .then(res => {
                            if(res) {
                                logger.info({ message: "Logged in" });
                                return done(null, user)
                            } else {
                                logger.info({ message: "wrong password"});
                                return done(null, false)
                            }
                        }).catch(err => {
                            console.log(err);
                            res.send(err);
                        }) 
                    }).catch(err => {
                        console.log(err);
                        res.send(err);
                    })
                })
        }
    ));
}