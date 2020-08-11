const {signup} = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// session false because we want stateless jwt
const requireAuth = passport.authenticate('jwt', {session: false});

module.exports = (app) => {
    app.get('/', requireAuth, (req, res) => {
        res.send({hi: 'there'});
    });

    app.post('/signup', signup);
};