const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ChatUser = new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    room: {type: mongoose.Schema.ObjectId, ref: 'Room', required: true},
    unreadMessageCount: {type: Number}
}, {
    timestamps: true,
    collection: 'ChatUser'
})

module.exports = ChatUser;