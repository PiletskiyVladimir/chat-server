const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const fa = require("moment/locale/fa");

const userSchema = new Schema({
    id: {type: String},
    publicKey: {type: String}
}, {
    _id: false
})

const Room = new Schema({
    users: [userSchema],
    lastMessage: {type: Object}
}, {
    timestamps: true,
    collection: 'Room'
})

module.exports = Room;