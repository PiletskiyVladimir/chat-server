const
    mongoose = require('../Config/database'),
    sendMail = require('../Config/nodemailer'),
    config = require('../Config/config.json'),

    User = mongoose.model('User'),
    Room = mongoose.model('Room'),

    moment = require('moment'),
    fsx = require('fs-extra'),
    path = require('path'),
    md5 = require('md5'),

    ValidationField = require('../Models/validationField'),

    FieldsValidator = require('../Utils/fieldsValidator'),
    {roomObj} = require('../Utils/modelObjects'),
    {handle, generateCode} = require('../Utils/utils'),
    {generateRoomKey} = require('../Utils/room');

async function getRoomsList (req, res) {
    // TODO search params, limits, offset

    let searchObj = {};

    let [rooms, roomsError] = await handle(Room.find(searchObj).lean().exec());

    if (roomsError) {
        return res.status(403).send({
            error: roomsError
        })
    }

    let [countRooms, countRoomsError] = await handle(Room.countDocuments(searchObj).lean().exec());

    if (countRoomsError) {
        return res.status(403).send({
            error: countRoomsError
        })
    }

    return res.status(200).send({
        data: rooms.map(el => roomObj(el)),
        count: countRooms
    });
}

async function createRoom (req, res) {
    let {users} = req.body;

    let params = [
        new ValidationField('users', users, 'arrayNumber', false, 'users')
    ]

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    obj['key'] = generateRoomKey(users);

    let [createdRoom, createdRoomError] = await handle(Room.create(obj));

    if (createdRoomError) {
        return res.status(403).send({
            error: createdRoomError
        })
    }

    return res.status(200).send(roomObj(createdRoom));
}

async function roomDetail (req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ]

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [room, roomError] = await handle(Room.findOne({_id: req.params.id}).lean().exec());

    if (roomError) {
        return res.status(403).send({
            error: roomError
        })
    }

    if (!room) {
        return res.status(404).end();
    }

    return res.status(200).send(roomObj(room));
}

async function updateRoom (req, res) {

}

async function deleteRoom (req, res) {

}

async function addUsersToRoom (req, res) {

}

async function removeUsersFromRoom (req, res) {

}

module.exports = {
    getRoomsList,
    createRoom,
    roomDetail,
    updateRoom,
    deleteRoom,
    addUsersToRoom,
    removeUsersFromRoom
}