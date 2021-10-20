const
    {searchParams}          = require('../Utils/utils'),
    mongoose                = require('../Config/database'),
    sendMail                = require('../Config/nodemailer'),
    config                  = require('../Config/config.json'),

    User                    = mongoose.model('User'),
    Room                    = mongoose.model('Room'),
    Message                 = mongoose.model('Message'),

    moment                  = require('moment'),
    fsx                     = require('fs-extra'),
    path                    = require('path'),
    md5                     = require('md5'),

    ValidationField         = require('../Models/validationField'),

    FieldsValidator         = require('../Utils/fieldsValidator'),
    {roomObj}               = require('../Utils/modelObjects'),
    {handle, generateCode}  = require('../Utils/utils'),
    {generateRoomKey}       = require('../Utils/room');

async function getRoomsList(req, res) {
    let {limit, offset, sortField, sortType} = searchParams(req);

    let params = [];

    let {errors, obj} = FieldsValidator(params);

    obj['users.id'] = req.user.id;

    if (errors.length > 0) return res.status(400).send(errors);

    let [foundRooms, foundRoomsError] = await handle(Room.find(obj).lean().exec());

    if (foundRoomsError) return res.status(500).send(foundRoomsError);

    let [totalCount, totalCountError] = await handle(Room.countDocuments(obj));

    if (totalCountError) return res.status(500).send(totalCountError);

    let result = [];

    for await (let el of foundRooms) {
        result.push(await roomObj(el, req.user.id));
    }

    return res.status(200).send({
        data: result,
        totalCount
    });
}

async function createRoom(req, res) {
    let params = [];

    if (req.body.users) {
        for (let user of req.body.users) {
            params.push(
                new ValidationField('id', user.id, 'string', false),
                new ValidationField('publicKey', user.publicKey, 'string', false)
            )
        }
    } else {
        return res.status(400).send({
            errors: ["FIELD USERS IS REQUIRED"]
        })
    }

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    obj['users'] = req.body.users;

    let [createdRoom, createdRoomError] = await handle(Room.create(obj));

    if (createdRoomError) return res.status(500).send(createdRoomError);

    return res.status(200).send(roomObj(createdRoom, req.user.id));
}

async function roomDetail(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(500).send(errors);

    let [room, roomError] = await handle(Room.findById(req.params.id).lean().exec());

    if (roomError) return res.status(500).send(roomError);

    if (!room) return res.status(404).end();

    return res.status(200).send(await roomObj(room, req.user.id));
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
        new ValidationField('id', req.params.id, 'string', false)
    ];

    if (req.body.users) {
        for (let user of req.body.users) {
            params.push(
                new ValidationField('id', user.id, 'string', false),
                new ValidationField('publicKey', user.publicKey, 'string', false)
            )
        }
    } else {
        return res.status(400).send({
            errors: ["FIELD USERS IS REQUIRED"]
        })
    }

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    obj['users'] = req.body.users;

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