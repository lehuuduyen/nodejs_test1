const {Strategy} = require('passport-local');
const User = require('../model/user');

module.exports = function (passport) {
  passport.use(
    new Strategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
      // find user
      User.findUserByEmail(email).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        // Match password
        if(User.comparePassword(password, user.password)){
          return done(null, user);
        }else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });

    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {

    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};