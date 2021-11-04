const
    moment = require('moment'),
    mongoose = require('../Config/database'),
    Message = mongoose.model('Message'),
    User = mongoose.model('User');

const fs = require('fs');

function normalizeTimeOutput (value) {
    if ((value + "").length < 2) return "0" + value;
    else return value;
} 

function timeOutput(time) {
    return normalizeTimeOutput(time.getHours()) + ":" + normalizeTimeOutput(time.getMinutes()) + ":" + normalizeTimeOutput(time.getSeconds());
}

function dateOutput(date) {

}

function dateTimeOutput (dateTime) {

}

function userObj (data) {
    return {
        id: data._id,
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        middleName: data.middleName,
        nickname: data.nickname,
        avatar: data.avatar,
        role: data.role,
        onlineStatus: data.onlineStatus,
        status: data.status,
        profileDescription: data.profileDescription,
        frozenUntil: data.frozenUntil,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
        publicKey: data.publicKey
    };
}

async function roomObj (data, user) {
    let resultObj = {
        id: data._id,
        lastMessage: messageObj(data.lastMessage, user),
        users: data.users,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    }

    let otherUserId = user === data.users[0].id ? data.users[1].id : data.users[0].id;

    resultObj.otherUser = userObj(await User.findById(otherUserId).lean().exec());

    return resultObj;
}

function messageObj (message, user) {
    let createdAtTime = new Date(message.createdAt);
    return {
        id: message._id,
        sender: message.sender,
        room: message.room,
        messageObj: message.messageObj[user],
        // createdAt: moment(message.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        // updatedAt: moment(message.updatedAt).format("YYYY-MM-DD hh:mm:ss")
        createdAt: timeOutput(createdAtTime)
    };
}

module.exports = {
    userObj,
    roomObj,
    messageObj
}