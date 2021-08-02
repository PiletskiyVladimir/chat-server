const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Room = new Schema({
    key: {type: String, required: true},
    lastMessage: {
        _id: false,
        sender: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
        addons: [Buffer],
        text: String,
        room: String,
        time: Date
    }
}, {
    timestamps: true,
    collection: 'Room'
})

module.exports = Room;