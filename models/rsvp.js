const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    status: {type: String,
        enum: ['yes', 'no', 'maybe'],
        default: 'maybe',
        required: [true, 'A status is required to RSVP!']},
    user: {type: Schema.Types.ObjectId, ref:"User"},
    event: {type: Schema.Types.ObjectId, ref:"Event"}
});

// Collection is named rsvps in the database
module.exports = mongoose.model('Rsvp', rsvpSchema);
