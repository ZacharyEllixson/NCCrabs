const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {type: String, 
        enum: ['watching', 'fishing', 'cooking', 'news', 'gear', 'other'],
        default: 'other', 
        required: [true, 'A category is required']},
    title: {type: String, required: [true, 'A title is required']},
    host: {type: Schema.Types.ObjectId, ref:"User"},
    details: {type: String, required: [true, 'Details about the event are required']},
    location: {type: String, required: [true, 'A location is required']},
    start: {type: Date, required: [true, 'A starting time is required']},
    end: {type: Date, required: [true, 'An ending time is required']},
    image: {type: String, required: [true, 'An image is required']}
});

// Collection name is events in the database
module.exports = mongoose.model('Event', eventSchema);
