const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Message = new Schema({
    sender: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    addons: [Buffer],
    text: String,
    room: String,
    time: Date
}, {
    timestamps: true,
    collection: 'Message'
});

module.exports = Message;