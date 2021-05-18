const
    jwt = require('jsonwebtoken'),
    config = require('../Config/config.json');

const handle = (promise) => {
    return promise
        .then(data => ([data, undefined]))
        .catch(error => Promise.resolve([undefined, error]));
}

function generateToken(userId, key) {
    return jwt.sign({id: userId, email: key}, config["jwt-token"]);
}

function generateCode() {
    let min = 100000, max = 999999;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasPasswordUpperCase (string) {
    for (let el of string) {
        if (el === el.toUpperCase() && isNaN(+el)) {
            return true;
        }
    }

    return false;
}

function hasPasswordLowerCase (string) {
    for (let el of string) {
        if (el === el.toLowerCase()) {
            return true;
        }
    }

    return false;
}

function hasPasswordNumber (string) {
    let hasNumber = /\d/;
    return hasNumber.test(string);
}

function passwordValidation (string) {
    if (string.length < 8) {
        return false;
    }

    return hasPasswordLowerCase(string) && hasPasswordUpperCase(string) && hasPasswordNumber(string);
}

module.exports = {
    handle,
    generateCode,
    generateToken,
    passwordValidation
}