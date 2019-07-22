const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../model/user');
const passport = require('passport/lib');

module.exports = {
  showFormLogin: (req, res) => {
    return res.render('auth/formLogin', { title: 'Login' })
  },

  login: (req, res, next) => {

    //Validation
    let errors = validationResult(req);
    if(errors && errors.array().length > 0){
      res.locals.errors = errors.array();
      res.redirect('/login');
    }
    // handle login
    passport.authenticate('local', {
      successRedirect: '/characters',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: 'Login success'
    })(req, res, next);
  },

  register: async (req, res) => {

    let errors = validationResult(req);
    if(errors && errors.array().length){
      res.locals.errors = errors.array();
      return res.render('auth/formRegister')
    }
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let obj = {
      email:        req.body.email,
      password:     hashPassword,
    };

    let user = new User(obj);
    user.save(function (err) {
      if (err) return res.send(500, 'Not found');
      req.flash('success_msg', 'Register success');
      res.redirect('/login');
    });
  },

  showFormRegister: (req, res) => {
    return res.render('auth/formRegister', { title: 'Register' })
  },

  logout: (req, res) =>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  }

};