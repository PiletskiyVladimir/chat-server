const
    { searchParams } = require('../Utils/utils'),
    mongoose = require('../Config/database'),
    sendMail = require('../Config/nodemailer'),
    config = require('../Config/config.json'),

    User = mongoose.model('User'),
    Room = mongoose.model('Room'),
    Message = mongoose.model('Message'),

    moment = require('moment'),
    fsx = require('fs-extra'),
    path = require('path'),
    md5 = require('md5'),

    ValidationField = require('../Models/validationField'),

    FieldsValidator = require('../Utils/fieldsValidator'),
    { roomObj } = require('../Utils/modelObjects'),
    { handle, generateCode } = require('../Utils/utils'),
    { generateRoomKey } = require('../Utils/room');

async function getRoomsList(req, res) {
    let { limit, offset, sortField, sortType } = searchParams(req);

    //

    let params = [
        new ValidationField('users', req.query.users, 'searchString', true, 'users')
    ];

    let { errors, obj } = FieldsValidator(params);

    if (errors.length > 0) return res.status(500).send(errors);

    let [foundRooms, foundRoomsError] = await handle(Room.find(obj).lean().exec());

    if (foundRoomsError) return res.status(500).send(foundRoomsError);

    let [totalCount, totalCountError] = await handle(Room.countDocuments(obj));

    if (totalCountError) return res.status(500).send(totalCountError);

    let result = foundRooms.map(el => roomObj(el));

    return res.status(200).send({
        data: result,
        totalCount
    });
}

async function createRoom(req, res) {
    let params = [
        new ValidationField('users', req.body.users, 'arrayString', false, 'users')
    ];

    let { errors, obj } = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let [createdRoom, createdRoomError] = await handle(Room.create(obj));

    if (createdRoomError) return res.status(500).send(createdRoomError);

    let [createdMessage, createdMessageError] = await handle(Message.create({
        sender: null,
        files: [],
        readBy: [req.user.id],
        text: "Start of conversation",
        room: createdRoom._id
    }));

    if (createdMessageError) return res.status(500).send(createdMessageError);

    let [updateRoom, updateRoomError] = await handle(Room.updateOne({ _id: createdRoom._id }, { lastMessage: createdMessage }).lean().exec());

    if (updateRoomError) return res.status(500).send(updateRoomError);

    let [foundedRoom, foundedRoomError] = await handle(Room.findById(createdRoom._id).lean().exec());

    if (foundedRoomError) return res.status(500).send(foundedRoomError)

    return res.status(200).send(roomObj(foundedRoom));
}

async function roomDetail(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ];

    let { errors, obj } = FieldsValidator(params);

    if (errors.length > 0) return res.status(500).send(errors);

    let [room, roomError] = await handle(Room.findById(req.params.id).lean().exec());

    if (roomError) return res.status(500).send(roomError);

    if (!room) return res.status(404).end();

    return res.status(200).send(roomObj(room));
}

async function deleteRoom(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let [room, roomError] = await handle(Room.findById(req.params.id));

    if (roomError) return res.status(500).send(roomError);

    if (!room) return res.status(404).end();

    let [deleteRoom, deleteRoomError] = await handle(Room.findByIdAndDelete(req.params.id));

    if (deleteRoomError) return res.status(500).send(deleteRoomError);

    return res.status(200).end();
}

async function updateUsersList(req, res) {
    let params = [
        new ValidationField('users', req.body.users, 'arrayString', false, 'users'),
        new ValidationField('id', req.params.id, 'string', false)
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let [room, roomError] = await handle(Room.findById(req.params.id));

    if (roomError) return res.status(500).send(roomError);

    if (!room) return res.status(404).end();

    let [updateRoom, updateRoomError] = await handle(Room.findByIdAndUpdate(req.params.id, obj));

    if (updateRoomError) return res.status(500).send(updateRoomError);

    return res.status(200).end();
}

module.exports = {
    getRoomsList,
    createRoom,
    roomDetail,
    deleteRoom,
    updateUsersList
}