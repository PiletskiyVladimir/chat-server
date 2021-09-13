const
    {searchParams} = require('../Utils/utils'),
    mongoose = require('../Config/database'),
    Message = mongoose.model('Message');
const ValidationField = require("../Models/validationField");

async function getMessagesList(req, res) {
    let params = [
        new ValidationField('id', req.query.id, 'searchString', true, '_id'),
        new ValidationField('sender', req.query.sender, 'searchString', true, 'sender'),
        new ValidationField('room', req.query.room, 'searchString', true, 'room')
    ];

    // TODO think how to search in array
}

async function createMessage(req, res) {

}

async function changeMessage(req, res) {

}

async function deleteMessage(req, res) {

}

module.exports = {
    getMessagesList, createMessage, changeMessage, deleteMessage
}