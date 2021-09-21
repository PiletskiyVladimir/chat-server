const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Message = new Schema({
    sender: {type: mongoose.Schema.ObjectId, ref: 'User'},
    readBy: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    room: {type: mongoose.Schema.ObjectId, ref: 'Room', required: true},
    messageObj: Schema.Types.Mixed
}, {
    timestamps: true,
    collection: 'Message'
});

module.exports = Message;