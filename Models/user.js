const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    onlineStatus: {type: String, enum: ['online', 'offline']},
    lastActive: {type: Date, default: null},
    email: {type: String, required: true},
    code: {type: String},
    codeExpiresIn: {type: Date},
    role: {type: String, enum: ['admin', 'user', 'operator'], default: 'user'},
    status: {type: String, enum: ['blocked', 'normal', 'frozen']},
    frozenUntil: {type: Date, default: null},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    avatar: {type: String, default: null},
    profileDescription: String,
    nickname: {type: String, required: true}
}, {
    timestamps: true,
    collection: 'User'
});

module.exports = User;