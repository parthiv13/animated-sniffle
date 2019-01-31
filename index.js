const express = require('express'),
    app = express(),
    uuid = require('uuid/v4'),
    morgan = require('morgan'),
    logger = require('./config/winston'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    setupApi = require('./routes/setup'),
    MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 8080;

const users = require('./database/user'),
url = require

require('./config/passport')(passport)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev', { "stream": logger.stream }));
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

app.use('/api', setupApi);

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

app.get('/authrequired', (req, res) => {
    logger.info({message: 'inside authreq'});
    if(req.isAuthenticated()) {
        res.send('Yolo')
    } else {
        res.redirect('/')
    }
})

app.listen(port, () => {
    console.log("listening on port 8080");
})