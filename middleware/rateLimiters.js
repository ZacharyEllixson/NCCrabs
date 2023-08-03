const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
        let err = new Error('Too many login requests, try again in a minute.');
        err.status = 429;
        return next(err);
    }
});
