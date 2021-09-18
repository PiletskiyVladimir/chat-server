const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Message = new Schema({
    sender: {type: mongoose.Schema.ObjectId, ref: 'User'},
    files: [[String]],
    readBy: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    text: [String],
    forUser: {type: mongoose.Schema.ObjectId, ref: 'User'},
    room: {type: mongoose.Schema.ObjectId, ref: 'Room', required: true}
}, {
    timestamps: true,
    collection: 'Message'
});

module.exports = Message;