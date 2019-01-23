const express = require('express'),
    app = express(),
    uuid = require('uuid/v4'),
    morgan = require('morgan'),
    logger = require('./config/winston'),
    session = require('express-session'),
    mongodb = require('mongodb');

const port = process.env.PORT || 8080;

app.use(morgan('combined', { stream: logger.stream }));
app.use(session({
    genid: (req) => {
        console.log(req.sessionID)
        return uuid()
    },
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    logger.info({message: req.sessionID});
    res.send('Homepage')
})

app.listen(port, () => {
    console.log("listening on port 8080");
})