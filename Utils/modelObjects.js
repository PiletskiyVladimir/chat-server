const
    moment = require('moment'),
    mongoose = require("mongoose");

function userObj (data) {
    // TODO return binary data from avatar
    return {
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        middleName: data.middleName,
        nickname: data.nickname,
        avatar: data.avatar,
        role: data.role,
        status: data.status,
        profileDescription: data.profileDescription,
        frozenUntil: data.frozenUntil,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
        publicKey: data.publicKey
    }
}

function roomObj (data) {
    return {
        id: data._id,
        lastMessage: messageObj(data.lastMessage),
        users: data.users,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    }
}

function messageObj (message, reader) {
    console.log(message.createdAt)
    return {
        id: message._id,
        sender: message.sender,
        room: message.room,
        messageObj: message.messageObj[reader],
        createdAt: moment(message.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(message.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    };
}

module.exports = {
    userObj,
    roomObj,
    messageObj
}