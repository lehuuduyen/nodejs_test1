const express = require('express');
const bodyParser = require('body-parser');
const flashMessage = require('connect-flash');
const session = require('express-session');
const path =require('path');
const dotenv = require('dotenv');
dotenv.config();
const {connection} = require('./db/connection');
const passport = require('passport');
const passportConfig = require('./config/passport');
const routes = require('./routes');

const app = express();

//config view
app.set('views', path.join(__dirname, './view'));
app.set('view engine', 'pug');

//config static folder
app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// config passport
passportConfig(passport);

//config session
app.use(session({
  secret: 'fsdfsddasd',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } //24h
}));

app.use(passport.initialize());
app.use(passport.session());

//config flash message
app.use(flashMessage());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.errors = req.flash('errors');
  next();
});

//config route
app.use('/', routes);

const port = process.env.PORT || '8000';
app.listen(port, () => {
  console.log(`Listing on ${port}`);
  connection();
});