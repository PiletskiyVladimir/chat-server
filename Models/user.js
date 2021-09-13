const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    code: {type: String},
    codeExpiresIn: {type: Date},
    onlineStatus: {type: String, enum: ['online', 'offline']},
    lastActive: {type: Date, default: null},
    avatar: {type: String, default: null},
    nickname: {type: String, required: true},
    role: {type: String, enum: ['admin', 'user', 'operator'], default: 'user'},
    status: {type: String, enum: ['blocked', 'normal', 'frozen']},
    frozenUntil: {type: Date, default: null},
    profileDescription: String,
    hidden: {type: Boolean},
    publicKey: {type: String}
}, {
    timestamps: true,
    collection: 'User'
});

module.exports = User;