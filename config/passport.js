const LocalStrategy =  require('passport-local').Strategy;
const logger = require('./winston')
const users = require('../database/user')

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        console.log('inside serialise callback');
        logger.debug({message: `${JSON.stringify(user)}`});
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        logger.info({message: 'deserializing user'});
        logger.debug({message: `${JSON.stringify(users[0])}`})
        const user = users[0].id === id ? users[0] : false;
        done(null, user)
    });

    passport.use('local-login', new LocalStrategy(
        { usernameField:'email' },
        (email, password, done) => {
            logger.info( {message: 'Local Strategy'});
            logger.debug({message: `${JSON.stringify(users[0])}`})
            const user = users[0];
            if(email == user.email && password == user.password) {
                console.log('localstrat retrun true' )
                return done(null, user);
            } else {
                logger.debug({message: 'return false'})
            }
        }
    ))
}