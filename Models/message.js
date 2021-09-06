const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Message = new Schema({
    sender: {type: mongoose.Schema.ObjectId, ref: 'User'},
    files: [{type: String, required: false}],
    readBy: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    text: String,
    room: {type: mongoose.Schema.ObjectId, ref: 'Room', required: true}
}, {
    timestamps: true,
    collection: 'Message'
});

module.exports = Message;