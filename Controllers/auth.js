const
    config = require('../Config/config.json'),
    jwt = require('jsonwebtoken');

async function auth (req, res) {
    // TODO
    return res.status(200).send({
        token: jwt.sign({id: 1, key: 1}, config["jwt-token"])
    })
}

module.exports = {
    auth
}