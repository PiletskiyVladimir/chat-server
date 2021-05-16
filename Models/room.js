const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Room = new Schema({
    key: {type: String, required: true},
    hasNewMessage: {type: Boolean},
    lastMessage: {
        id: {type: String},
        sender: {type: String},
        message: {type: String},
        type: {type: String},
        date: {type: 'Moment'}
    },
    users: [{type: String}],
    createdAt: {type: 'Moment'},
    updatedAt: {type: 'Moment'}
}, {
    timestamps: true,
    collection: 'Room'
})

module.exports = Room;