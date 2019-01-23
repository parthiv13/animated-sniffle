const express = require('express'),
    app = express(),
    uuid = require('uuid/v4'),
    morgan = require('morgan'),
    logger = require('./config/winston'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongodb = require('mongodb');

const port = process.env.PORT || 8080;

const users = require('./database/user')

require('./config/passport')(passport)

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
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    console.log({message: req.sessionID});
    res.send('Homepage')
})

app.get('/login', (req, res) => {
    logger.info({ id: req.sessionID })
    
})

app.post('/login', (req, res, next) => {
    logger.info({ message: `${JSON.stringify(req.body)}`});
    passport.authenticate('local-login', (err, user, info) => {
        logger.info({ message: 'in login in POST' });
        req.login(user, (err) => {
            if(err) {
                logger.info({message: err})
                return res.send("hell no")
            }
            logger.info({ passport: `${JSON.stringify(req.session.passport )}`})
            return res.send('Authenticated')
        })
    })(req, res, next)
})

app.listen(port, () => {
    console.log("listening on port 8080");
})