const
    mongoose = require('../Config/database'),
    sendMail = require('../Config/nodemailer'),
    config = require('../Config/config.json'),

    User = mongoose.model('User'),

    moment = require('moment'),

    ValidationField = require('../Models/validationField'),

    FieldsValidator = require('../Utils/fieldsValidator'),
    {userObj} = require('../Utils/modelObjects'),
    {handle, generateCode} = require('../Utils/utils');

async function getUsersList (req, res) {
    console.log(req.user)
    console.log(req.query);
    res.send(req.query);
}

async function createUser (req, res) {
    /* fields
        * email
        * password
        * name
        * lastName
        * middleName
    */

    let {email, password, name, lastName, middleName} = req.body;

    let params = [
        new ValidationField('email',        email,      'email',    false, 'email'),
        new ValidationField('password',     password,   'password', false, 'password'),
        new ValidationField('name',         name,       'string',   false, 'name'),
        new ValidationField('lastName',     lastName,   'string',   false, 'lastName'),
        new ValidationField('middleName',   middleName, 'string',   true,  'middleName')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findOne({email: email}).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (findUser) {
        return res.status(409).end();
    }

    obj.code = generateCode();
    obj.codeExpiresIn = moment(moment().valueOf() + 600000).format('YYYY-MM-DD HH:mm:ss');

    let [createdUser, createdUserError] = await handle(User.create(obj));

    if (createdUserError) {
        return res.status(403).send({
            error: createdUserError
        })
    }

    let [sendEmail, sendEmailError] = await handle(sendMail(config.email.sender, createdUser.email, 'Secure chat authorization code', 'Your chat auth code is -> ' + createdUser.code));

    if (sendEmailError) {
        return res.status(403).send({
            error: sendEmailError
        })
    }

    return res.status(200).send(userObj(createdUser));
}

async function getUserInfo (req, res) {

}

async function updateUser (req, res) {

}

async function deleteUser (req, res) {

}

async function blockUser (req, res) {

}

async function unblockUser (req, res) {

}

module.exports = {
    getUsersList,
    createUser,
    getUserInfo,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser
}