const {searchParams, handle} = require('../Utils/utils');
const mongoose = require('../Config/database');
const Message = mongoose.model('Message');
const ValidationField = require("../Models/validationField");
const FieldsValidator = require('../Utils/fieldsValidator');
const {messageObj} = require('../Utils/modelObjects');
const Room = mongoose.model('Room');

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
        new ValidationField('room', req.body.room, 'string', false, 'room'),
        new ValidationField('messageObj', req.body.messageObj, 'messageObj', false, 'messageObj')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    obj['sender'] = user;
    obj['readBy'] = [user];

    let [createdMessage, createdMessageError] = await handle(Message.create(obj));

    if (createdMessageError) return res.status(500).send(createdMessageError);

    let [updatedRoom, updatedRoomError] = await handle(Room.updateOne({_id: req.body.room}, {
        lastMessage: createdMessage
    }));

    if (updatedRoomError) return res.status(500).send(updatedRoomError);

    // TODO add socket notification

    return res.status(200).send(messageObj(createdMessage, user));
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

async function messageDetail(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let [message, messageError] = await handle(Message.findById(req.params.id));

    if (messageError) return res.status(500).send(messageError);

    if (!message) return res.status(404).end();

    return res.status(200).send(messageObj(message, req.user.id));
}

module.exports = {
    getMessagesList, createMessage, changeMessage, deleteMessage, messageDetail
}