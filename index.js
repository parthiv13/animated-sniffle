const express = require('express'),
    app = express(),
    uuid = require('uuid/v4'),
    morgan = require('morgan'),
    logger = require('./config/winston'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb');

const port = process.env.PORT || 8080;

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        logger.info( {message: 'Local Strategy'});
        const user = users[0]
        if(email == user.email && password == user.password) {
            logger.info({ message: 'localstrat retrun true' })
            return done(null, user);
        }
    }
))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined', { "stream": logger.stream }));
app.use(session({
    genid: (req) => {
        logger.info(req.sessionID)
        return uuid()
    },
    store: new FileStore(),
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    logger.info({message: req.sessionID});
    res.send('Homepage')
})

app.get('/login', (req, res) => {
    logger.info({ id: req.sessionID })
    passport.authenticate('local', (err, user, info) => {
        logger.info({ message: 'in login in POST' });
        req.login(user, (err) => {
            logger.info({ passport: `${JSON.stringify(req.session.passport )}`})
        })
    })
})

app.post('/login', (req, res) => {
    logger.info({ id: req.body })
})

app.listen(port, () => {
    console.log("listening on port 8080");
})