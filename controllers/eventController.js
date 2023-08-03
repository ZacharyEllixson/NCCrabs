const Event = require('../models/event');
const Rsvp = require('../models/rsvp');
const validator = require('validator');

// GET /events
exports.index = (req, res, next) => {
    Event.find()
    .then(events => res.render('./event/events', {events}))
    .catch(err => next(err));
};

// GET /events/newEvents
exports.new = (req, res) => {
    return res.render('./event/newEvent');
};

// POST /events
exports.create = (req, res, next) => {
    let event = new Event(req.body);
    let image = req.file.filename;
    event.image = image;

    event.host = req.session.user;

    event.save()
    .then((event) => {
        req.flash('success', 'Your event has been created!');
        return res.redirect('/events');
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        return next(err);
    });  
};

// GET /events/:id
exports.show = (req, res, next) => {
    let id = req.params.id;

    Promise.all([Event.findById(id).populate('host', 'firstName'), Rsvp.find({event: id, status: 'yes'})])
    .then(results => {
        const [event, rsvps] = results;
        if(event) {
            let startTime = event.start.toDateString() + ' ' + event.start.toLocaleTimeString();
            let endTime = event.end.toDateString() + ' ' + event.end.toLocaleTimeString();         

            event.title = validator.unescape(event.title);
            event.details = validator.unescape(event.details);

            return res.render('./event/event', {event, startTime, endTime, rsvps});
        } else {
            let err = new Error('Page not Found: ' + req.url);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));    
};

// GET /events/:id/edit
exports.edit = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
    .then(event => {
        event.start.setMinutes(event.start.getMinutes() - event.start.getTimezoneOffset());
        let startTime = event.start.toISOString().slice(0, 16);
        event.end.setMinutes(event.end.getMinutes() - event.end.getTimezoneOffset());
        let endTime = event.end.toISOString().slice(0, 16);

        return res.render('./event/editEvent', {event, startTime, endTime});
    })
    .catch(err => next(err));
};

// PUT /events/:id
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    if (req.file) {
        let image = req.file.filename;
        event.image = image;
    }

    Event.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
        req.flash('success', 'Your event has been updated!');
        return res.redirect('/events/' + id);
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        return next(err);
    });
};

// DELETE /events/:id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    Promise.all([Event.findByIdAndDelete(id, {useFindAndModify: false}), Rsvp.deleteMany({event: id})])
    .then(results => {
        req.flash('success', 'Your event has been deleted!');
        return res.redirect('/events');
    })
    .catch(err => next(err));
};

// POST /events/:id/rsvp
exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    const rsvp = {status: req.body.rsvp, user: req.session.user, event: id};
    //console.log(rsvp);

    Rsvp.findOneAndUpdate({'user': req.session.user, 'event': id}, rsvp, {
        upsert: true
    })
    .then(rsvp => {
        req.flash('success', 'You have successfully responded!');
        return res.redirect('/user/profile');
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        return next(err);
    });
};
