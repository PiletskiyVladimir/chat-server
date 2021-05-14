const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    passwordSalt: {type: String},
    role: {type: String, enum: ['admin', 'user', 'operator']},
    status: {type: String, enum: ['blocked', 'normal', 'frozen']},
    frozenUntil: {type: 'Moment'},
    name: String,
    lastName: String,
    middleName: String,
    avatar: Buffer,
    profileDescription: String
});

module.exports = User;