const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

// GET /
router.get('/', controller.index);

// GET /contact
router.get('/contact', controller.contact);

// GET /about
router.get('/about', controller.about);

// GET /landing
router.get('/landing', controller.landing);

module.exports = router;
