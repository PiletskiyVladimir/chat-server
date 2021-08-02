const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Logs = new Schema({
    message: String,
    body: String,
    status: Number
}, {
    timestamps: true,
    collection: 'Logs'
});

module.exports = Logs;