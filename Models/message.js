const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Message = new Schema({
    sender: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    addons: [Buffer],
    text: String,
    room: Number,
    time: Date
});

module.exports = Message;