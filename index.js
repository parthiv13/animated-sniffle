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

//bodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Logger Middleware
app.use(morgan('dev', { "stream": logger.stream }));

//Express Session Middleware
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

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', setupApi);

app.get('/', (req, res) => {
    console.log({message: req.sessionID});
    res.send('Homepage')
})

app.post('/login', (req, res) => {
    logger.info({ message: `${JSON.stringify(req.sessionID)}` })
    
})

app.get('/login', (req, res, next) => {
    logger.info({ message: `${JSON.stringify(req.query)}`});
    passport.authenticate('local-login', (err, user, info) => {
        logger.info({ message: 'in login in POST' });
        req.logIn(user, (err) => {
            if(err) {
                logger.info({message: `req.query: ${JSON.stringify(user)}`})
                return next(err)
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