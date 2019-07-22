const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {authValidation} = require('../formValidation/authValidation');
const {forwardAuthenticated} = require('../middleware/authMiddleware');

router.get('/login', forwardAuthenticated, authController.showFormLogin);
router.post('/login', authValidation('login'), authController.login);

router.get('/register', forwardAuthenticated, authController.showFormRegister);
router.post('/register', authValidation('register'), authController.register);

router.get('/logout', authController.logout);

module.exports = router;