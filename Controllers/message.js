const {searchParams, handle} = require('../Utils/utils');
const mongoose = require('../Config/database');
const Message = mongoose.model('Message');
const ValidationField = require("../Models/validationField");
const FieldsValidator = require('../Utils/fieldsValidator');
const {messageObj} = require('../Utils/modelObjects');

async function getMessagesList(req, res) {
    let params = [
        new ValidationField('id', req.query.id, 'searchString', true, '_id'),
        new ValidationField('sender', req.query.sender, 'searchString', true, 'sender'),
        new ValidationField('room', req.query.room, 'searchString', true, 'room'),
        new ValidationField('forUser', req.query.user, 'string', true, 'forUser')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let [messages, messagesError] = await handle(Message.find(obj).lean().exec());

    if (messagesError) return res.status(500).send(messagesError);

    return res.status(200).send(messages);
}

async function createMessage(req, res) {
    let user = req.user.id;

    let params = [

    ];

    // TODO do it later
}

async function changeMessage(req, res) {

}

async function deleteMessage(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let [message, messageError] = await handle(Message.findById(req.params.id).lean().exec());

    if (messageError) return res.status(500).send(messageError);

    if (!message) return res.status(404).end();

    let [deleteMessage, deleteMessageError] = await handle(Message.deleteOne({_id: req.params.id}));

    if (deleteMessageError) return res.status(500).send(deleteMessageError);

    return res.status(200).end();
}

module.exports = {
    getMessagesList, createMessage, changeMessage, deleteMessage
}