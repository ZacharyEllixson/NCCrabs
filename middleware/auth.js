const Event = require('../models/event');

// Check if user isn't logged in
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/user/profile');
    }
};

// Check if the user is logged in
exports.isUser = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to be logged in first!');
        return res.redirect('/user/login');
    }
};

//Check if the user created the event
exports.isHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.host == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized access to this resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Page not Found: ' + req.url);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};

// Check that the user did not create the event
exports.isNotHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.host != req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized access to this resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Page not Found: ' + req.url);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};
