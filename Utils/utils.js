const
    jwt = require('jsonwebtoken'),
    config = require('../Config/config.json');

const handle = (promise) => {
    return promise
        .then(data => ([data, undefined]))
        .catch(error => Promise.resolve([undefined, error]));
}

function generateToken(userId, email, userRole) {
    return jwt.sign({id: userId.toString(), email: email, userRole: userRole}, config["jwt-token"]);
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

function searchParams (req) {
    let limit = 10,
        offset = 0,
        sortField = "_id",
        sortType = 0;

    if (req.query.sortType !== undefined) {
        switch (req.query.sortType) {
            case '1':
            case 'asc':
            case "ASC": {
                sortType = 0;
                break;
            }
            case '0':
            case 'desc':
            case "DESC": {
                sortType = 1;
                break;
            }
        }
    }

    if (req.query.sortField !== undefined) {
        sortField = req.query.sortField;
    }

    if (req.query.limit !== undefined && !isNaN(req.query.limit)) {
        limit = req.query.limit;
    }

    if (req.query.offset !== undefined && !isNaN(req.query.offset)) {
        offset = req.query.offset;
    }

    return {limit, offset, sortField, sortType};
}

module.exports = {
    handle,
    generateCode,
    generateToken,
    passwordValidation,
    searchParams
}