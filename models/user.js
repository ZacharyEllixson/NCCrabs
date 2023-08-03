const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'A first name is required']},
    lastName: {type: String, required: [true, 'A last name is required']},
    email: {type: String, required: [true, 'An email is required'], unique: true},
    password: {type: String, required: [true, 'A password is required']}
});

// Hash the password before saving it in the database
userSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password')) {
        return next();
    } else {
        bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
    }
});

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
};

// Collection name is users in the database
module.exports = mongoose.model('User', userSchema);
