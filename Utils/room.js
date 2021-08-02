function generateRoomKey (users) {
    return Buffer.from(users.join(',')).toString('base64');
}

module.exports = {
    generateRoomKey
}