const
    mongoose = require('../Config/database'),
    sendMail = require('../Config/nodemailer'),
    config = require('../Config/config.json'),

    User = mongoose.model('User'),

    moment = require('moment'),
    fsx = require('fs-extra'),
    path = require('path'),
    md5 = require('md5'),

    ValidationField = require('../Models/validationField'),

    FieldsValidator = require('../Utils/fieldsValidator'),
    {userObj} = require('../Utils/modelObjects'),
    {handle, generateCode} = require('../Utils/utils'),
    {GetRights, IsAdmin, IsCurrentUser} = require('../Utils/rightsDescription');

async function getRoomsList (req, res) {

}

async function createRoom (req, res) {

}

async function roomDetail (req, res) {

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