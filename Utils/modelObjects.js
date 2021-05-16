const
    moment = require('moment');

function userObj (data) {
    return {
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        middleName: data.middleName,
        avatar: data.avatar,
        role: data.role,
        status: data.status,
        profileDescription: data.profileDescription,
        frozenUntil: data.frozenUntil,
        createdAt: moment(data.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: moment(data.updatedAt).format("YYYY-MM-DD hh:mm:ss")
    }
}

module.exports = {
    userObj
}