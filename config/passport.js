const LocalStrategy =  require('passport-local').Strategy;
const logger = require('./winston');
const users = require('../database/user');
const MongoClient = require('mongodb').MongoClient;
const databaseURL = require('../config/database').mongolocal;
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        console.log(user);
        //let id = user.username;
        logger.debug({message: `${JSON.stringify(user)}`});
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        logger.info({message: 'deserializing user'});
        logger.debug({message: `${JSON.stringify(id)}`})
        MongoClient.connect(databaseURL, {useNewUrlParser: true})
        .then(client => {
            client.db("sendtodevice").collection("test").findOne({ name: id})
            .then(user => {
                done(null, user);
            }).catch(err => {
                console.log(err);
            })
        })
    });

    passport.use('local-login', new LocalStrategy(
        { passReqToCallback : true },
        (username, password, done) => {
            logger.info({messe: 'Local Strategy'});
            logger.debug({message: `${JSON.stringify(username)}`})
            const user = users[0];
            MongoClient.connect(databaseURL, {useNewUrlParser: true})
                .then(client => {
                    logger.info({message: 'Connected to Mongo'});
                    client.db("sendtodevice").collection("test").findOne({ name: username })
                    .then(data => {
                        logger.info({ data: data[0]})
                        bcrypt.compare(password, data[0].password)
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
                            res.done(null, false, {message: `${JSON.stringify(err)}`});
                        }) 
                    }).catch(err => {
                        console.log(err);
                        res.send("err");
                    })
                })
        }
    ));
}