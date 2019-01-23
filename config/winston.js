const winston = require('winston');

var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMedia: { service: 'user-service' },
    transports: [
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
}

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;