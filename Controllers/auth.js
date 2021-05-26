const
    mongoose = require('../Config/database'),
    sendMail = require('../Config/nodemailer'),
    config = require('../Config/config.json'),

    User = mongoose.model('User'),

    moment = require('moment'),

    ValidationField = require('../Models/validationField'),

    FieldsValidator = require('../Utils/fieldsValidator'),
    {userObj} = require('../Utils/modelObjects'),
    {handle, generateCode, generateToken} = require('../Utils/utils');

async function sendCode (req, res) {
    /* fields
        * email
    */

    let {email} = req.body;

    let params = [
        new ValidationField('email', email, 'email', false, 'email')
    ]

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({errors: errors});
    }

    let [user, userError] = await handle(User.findOne(obj).lean().exec());

    if (userError) {
        return res.status(403).send({
            error: userError
        })
    }

    if (!user) {
        return res.status(404).end();
    }

    let code = generateCode(),
        codeExpiresIn = moment(moment().valueOf() + 600000).format('YYYY-MM-DD HH:mm:ss');

    let [updatedUser, updatedUserError] = await handle(User.findOneAndUpdate(obj, {
        code: code,
        codeExpiresIn: codeExpiresIn
    }));

    if (updatedUserError) {
        return res.status(403).send({
            error: updatedUserError
        })
    }

    let [sendEmail, sendEmailError] = await handle(sendMail(config.email.sender, user.email, 'Secure chat authorization code', 'Your chat auth code is -> ' + code));

    if (sendEmailError) {
        return res.status(403).send({
            error: sendEmailError
        })
    }

    return res.status(200).end();
}

async function auth(req, res) {
    /* fields
        * email
        * code
    */

    let {email, code} = req.body;

    let params = [
        new ValidationField('email', email, 'email', false, 'email'),
        new ValidationField('code', code, 'number', false, 'code')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({errors: errors});
    }

    let [findUser, findUserError] = await handle(User.findOne({email: obj.email}).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) {
        return res.status(404).end();
    }

    if (+findUser.code !== obj.code) {
        return res.status(401).end();
    }

    if (moment(findUser.codeExpiresIn).valueOf() < moment().valueOf()) {
        return res.status(401).end();
    }

    let [userAuthUpdate, userAuthUpdateError] = await handle(User.findByIdAndUpdate(findUser._id, {
        code: null,
        codeExpiresIn: null
    }));

    if (userAuthUpdateError) {
        return res.status(403).send({
            error: userAuthUpdateError
        })
    }

    res.status(200).json({key: findUser.email, token: generateToken(findUser._id, findUser.email, findUser.role)});
}

module.exports = {
    sendCode,
    auth
}