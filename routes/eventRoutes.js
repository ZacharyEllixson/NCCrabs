const express = require('express');
const controller = require('../controllers/eventController');
const { fileUpload } = require('../middleware/fileUpload');
const { isUser, isHost, isNotHost } = require('../middleware/auth');
const { validateId, validateEvent, unescape, validateRsvp, validateResult } = require('../middleware/validate');

const router = express.Router();

// GET /events
router.get('/', controller.index);

// GET /events/newEvents
router.get('/newEvent', isUser, controller.new);

// POST /events
router.post('/', isUser, fileUpload, validateEvent, validateResult, controller.create);

// GET /events/:id
router.get('/:id', validateId, controller.show);

// GET /events/:id/edit
router.get('/:id/edit', isUser, validateId, isHost, controller.edit);

// PUT /events/:id
router.put('/:id', isUser, validateId, isHost, fileUpload, validateEvent, validateResult, controller.update);

// DELETE /events/:id
router.delete('/:id', isUser, validateId, isHost, controller.delete);

// POST /events/:id/rsvp
router.post('/:id/rsvp', isUser, validateId, isNotHost, validateRsvp, validateResult, controller.rsvp);

module.exports = router;
