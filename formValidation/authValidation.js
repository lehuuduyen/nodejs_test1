const {body} = require('express-validator');
const User = require('../model/user');


const confirmPassword = (value, {req}) => {
  if (value !== req.body.confirmPassword) {
    return false
  } else {
    return value;
  }
};

module.exports = {

  authValidation: method => {
    switch (method) {
      case 'login': {
        return [
          body('email', 'Email required').not().isEmpty(),
          body('password', 'Password required').not().isEmpty(),
        ]
      }
      case 'register': {
        return [
          body('email')
            .not().isEmpty().withMessage('Email required')
            .isEmail().withMessage('Email invalid')
            .custom(value => {
              return User.findUserByEmail(value).then(user => {
                if (user) {
                  return Promise.reject('Email already in use');
                }
              });
            }),
          body('confirmPassword')
            .not().isEmpty().withMessage('Confirm Password required'),

          body('password')
            .not().isEmpty().withMessage('Password required')
            .isLength({ min: 6 }).withMessage('Password need more than 6 character')
            .custom(confirmPassword).withMessage('Passwords don\'t match')
        ]
      }
    }
  }
};
