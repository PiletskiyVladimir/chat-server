const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Room = new Schema({
    users: [{type: String}],
    lastMessage: {type: Object}
}, {
    timestamps: true,
    collection: 'Room'
})

module.exports = Room;