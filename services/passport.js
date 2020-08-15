const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

// Create local strategy (for verifying email and password creds when signing in)
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // verify email and password
    // call done with user if has correct creds
    // else call done with false
    User.findOne({email}, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);

        // compare passwords
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) return done(null, false);

        return done(null, user);
    });
});


// Setup options for jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// create jwt strategy (for verifying a token for making auth'd requests)
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user ID in the payload exists in our db
    // if so, call done with that user 
    // else call done without a user object
    User.findById(payload.sub, (err, user) => {
        if (err) return done(err, false);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
