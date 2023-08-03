const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isUser} = require('../middleware/auth');
const {logInLimiter} = require('../middleware/rateLimiters');
const {validateSignUp, validateLogin, validateResult} = require('../middleware/validate');

const router = express.Router();

// GET /user/new
router.get('/new', isGuest, controller.new);

// POST /user Create new account
router.post('/new', isGuest, validateSignUp, validateResult, controller.create);

// GET /user/login
router.get('/login', isGuest, controller.form);

// POST /user/login Log into account
router.post('/login', logInLimiter, isGuest, validateLogin, validateResult, controller.login);

// GET /user/profile
router.get('/profile', isUser, controller.profile);

// GET /user/logout
router.get('/logout', isUser, controller.logout);

module.exports = router;
