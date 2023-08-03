// Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
require('dotenv').config();

const mainRoutes = require('./routes/mainRoutes'); // main routes
const eventRoutes = require('./routes/eventRoutes'); // event routes
const userRoutes = require('./routes/userRoutes'); // user routes

// Application
const app = express();

// Config
let port = process.env.SERVER_PORT;
let host = process.env.SERVER_HOST;
let url = process.env.DATABASE_URL;
// Set the view engine to ejs
app.set('view engine', 'ejs');

// Connect to MongoDB and start app
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    // Server
    app.listen(port, host, () => {
    console.log('Server is running on port', port);
});
})
.catch(err => console.log(err.message));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: process.env.DATABASE_URL}),
    cookie: {MaxAge: 24*60*60*1000}
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.firstName = req.session.userFirstName||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

// Routes with prefix "/"
app.use('/', mainRoutes);

// Routes with prefix "/events"
app.use('/events', eventRoutes);

// Routes with prefix "/user"
app.use('/user', userRoutes);

// 404
app.use((req, res, next) => {
    let err = new Error('Page not found: ' + req.url)
    err.status = 404;
    return next(err);
});

// Error handler
app.use((err, req, res, next) => {
    console.log(err.stack);

    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }

    res.status(err.status);
    res.render('error', {error: err});
});
