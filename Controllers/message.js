const
    {searchParams} = require('../Utils/utils'),
    mongoose = require('../Config/database'),
    Message = mongoose.model('Message');


async function getMessagesList(req, res) {

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