const express = require('express');
const authRoute = require('./authRoute');
const characterRoute = require('./characterRoute');
const router = express.Router();
const {ensureAuthenticated} = require('../middleware/authMiddleware');

router.use('/',authRoute);
router.use('/characters', ensureAuthenticated, characterRoute);
router.get('/', (req, res) => {
  return res.render('home', {title: 'Home'})
});

module.exports = router;