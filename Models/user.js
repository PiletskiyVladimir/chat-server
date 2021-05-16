const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    email: {type: String, required: true},
    code: {type: String},
    codeExpiresIn: {type: 'Moment'},
    role: {type: String, enum: ['admin', 'user', 'operator']},
    status: {type: String, enum: ['blocked', 'normal', 'frozen']},
    frozenUntil: {type: 'Moment', default: null},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    middleName: String,
    avatar: Buffer,
    profileDescription: String
}, {
    timestamps: true,
    collection: 'User'
});

module.exports = User;