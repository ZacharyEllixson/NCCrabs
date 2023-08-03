const User = require('../models/user');
const Events = require('../models/event');
const Rsvp = require('../models/rsvp');

exports.new = (req, res) => {
    return res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);

    if(user.email) {
        user.email = user.email.toLowerCase();
    }

    user.save()
    .then(() => {
        req.flash('success', 'You have successfully created an account!');
        return res.redirect('/user/login')
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/user/new');
        }

        if (err.code === 11000) {
            req.flash('error', 'Email is already in use!')
            return res.redirect('/user/new');
        }
        
        return next(err);
    });
};

exports.form = (req, res) => {
    return res.render('./user/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if(email) {
        email = email.toLowerCase();
    }

    User.findOne({email: email})
    .then(user => {
        if(user) {
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id; // Store ID in the session
                    req.session.userFirstName = user.firstName; // Store first name in the session
                    req.flash('success', 'You have successfully logged in!');
                    return res.redirect('/landing');
                } else {
                    req.flash('error', 'Incorrect password!');
                    return res.redirect('/user/login');
                }
            })
            .catch(err => next(err));
        } else {
            req.flash('error', 'Incorrect email!');
            return res.redirect('/user/login');
        }
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;

    Promise.all([User.findById(id), Events.find({host: id}), Rsvp.find({user: id}).populate('event', 'title')])
    .then(results => {
        const [user, events, rsvps] = results;
        return res.render('./user/profile', {user, events, rsvps});
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err)
        } else {
            return res.redirect('/user/login');
        }
    });
};
