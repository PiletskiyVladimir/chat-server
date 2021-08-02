const
    moment = require('moment');

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
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    }
}

function roomObj (data) {
    return {
        id: data._id,
        key: data.key,
        hasNewMessage: data.hasNewMessage,
        lastMessage: {
            id: data.lastMessage.id,
            sender: data.lastMessage.sender,
            message: data.lastMessage.message,
            type: data.lastMessage.type,
            date: moment(data.lastMessage.date).format("YYYY-MM-DD hh:mm:ss")
        },
        users: data.users,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    }
}

module.exports = {
    userObj,
    roomObj
}