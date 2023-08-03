const { body, validationResult } = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;

    // objectID is 24-bit hexadecimal string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty.').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty.').notEmpty().trim().escape(),
body('email', 'You must use a valid email address.').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8 and 64 characters').isLength({min: 8, max: 64})];

exports.validateLogin = [body('email', 'You must use a valid email address.').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8 and 64 characters').isLength({min: 8, max: 64})];

exports.validateEvent = [body('category', 'There must be a category selected.').notEmpty().trim().escape().isIn(['watching', 'fishing', 'cooking', 'news', 'gear', 'other']),
body('title', 'There must be a title for the event.').notEmpty().trim().escape(),
body('details', 'Details about the event are required').notEmpty().trim().escape(),
body('location', 'The event must have a location.').notEmpty().trim().escape(),
body('start', 'The start date must be a future date.').notEmpty().isISO8601().isAfter(new Date().toDateString()).trim().escape(),
body('end', 'The end date must be a future date.').notEmpty().isISO8601().custom((value, {req}) => {
    if (new Date(value) <= new Date(req.body.start)) {
        throw new Error('The end date must come after the start date.');
    } else {
        return true;
    }
}).trim().escape()];

exports.validateRsvp = [body('rsvp', 'A status is required to RSVP!').notEmpty().trim().escape().isIn(['yes', 'no', 'maybe'])];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        
        return res.redirect('back');
    } else {
        return next();
    }
};
