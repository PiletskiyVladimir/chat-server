let expressJwt = require('express-jwt'),
    config = require('./config.json');

module.exports = expressJwt({
    secret: config["jwt-token"],
    algorithms: ['RS256'],
    getToken: function (req) {
        if (req.header("token")) {
            return req.header("token");
        }
        return null;
    }
});