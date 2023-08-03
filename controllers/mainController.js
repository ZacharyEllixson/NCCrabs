// GET /
exports.index = (req, res) => {
    return res.render('index');
};

// GET /contact
exports.contact = (req, res) => {
    return res.render('contact');
};

//GET /about
exports.about = (req, res) => {
    return res.render('about');
};

//GET /landing
exports.landing = (req, res) => {
    return res.render('landing')
};
