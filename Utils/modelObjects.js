const
    moment = require('moment'),
    mongoose = require('../Config/database'),
    Message = mongoose.model('Message');

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

async function roomObj (data, user) {
    let resultObj = {
        id: data._id,
        lastMessage: messageObj(data.lastMessage, user),
        users: data.users,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    }

    return resultObj;
}

function messageObj (message, user) {
    return {
        id: message._id,
        sender: message.sender,
        room: message.room,
        messageObj: message.messageObj[user],
        createdAt: moment(message.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(message.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    };
}

module.exports = {
    userObj,
    roomObj,
    messageObj
}