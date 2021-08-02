const
    jwt = require('jsonwebtoken'),
    config = require('../Config/config.json');

async function checkTokenForSocket(socket, next) {
    let token = socket.handshake.query.token;

    if (token) {
        jwt.verify(token, config["jwt-token"],function (err, decoded) {
            if (err) {
                next(new Error('Invalid token'));
            } else {
                socket.user = decoded;
                next();
            }
        });
    } else {
        let err = new Error('No authorization token was found');
        next(err);
    }
}

module.exports = {
    checkTokenForSocket
}