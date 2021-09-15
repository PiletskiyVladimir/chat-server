const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {type: String},
    publicKey: {type: String}
})

const Room = new Schema({
    users: [userSchema],
    lastMessage: {type: Object}
}, {
    timestamps: true,
    collection: 'Room'
})

module.exports = Room;