const User = require('../models/user');
const jwt = require('jwt-simple');
const {secret} = require('../config');
const bcrypt = require('bcrypt');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();

    return jwt.encode({sub: user.id, iat: timestamp}, secret);
};

const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

exports.signin = (req, res, next) => {
    // User has already had their email and password auth'd
    // They just need a token
    // User (req.user) is from "done(null, user)" in passport.localLogin function
    const token = tokenForUser(req.user);

    res.send({token});
};

exports.signup = (req, res, next) => {
    // See if user with given email exists
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(422).send({
            error: 'You must provide email and password'
        });
    }

    User.findOne({email}, (err, foundUser) => {
        if (err) {
            return next(err);
        }

        // If a user does exist, return an error
        if (foundUser) {
            return res.status(422).send({ error: 'Email is in use'});
        }

        // If a user with email does not exist, create and save a user
        const encryptedPassword = encryptPassword(password);
        const user = new User({
            email,
            password: encryptedPassword
        });

        user.save((err) => {
            if (err) {
                return next(err);
            }

            // respond to request success
            const token = tokenForUser(user);

            res.json({token});
        });
    });
};