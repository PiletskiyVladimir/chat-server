const
    UserRights = require('../Rights/MainRights'),

    mongoose = require('../Config/database'),
    sendMail = require('../Config/nodemailer'),
    config = require('../Config/config.json'),

    User = mongoose.model('User'),

    moment = require('moment'),
    fsx = require('fs-extra'),
    path = require('path'),
    md5 = require('md5'),

    ValidationField = require('../Models/validationField'),

    FieldsValidator = require('../Utils/fieldsValidator'),
    {userObj} = require('../Utils/modelObjects'),
    {handle, generateCode, searchParams} = require('../Utils/utils');

async function getUsersList(req, res) {
    // TODO search params., limits, offset

    let {limit, offset, sortField, sortType} = searchParams(req);

    let params = [
        new ValidationField('email', req.query.email, 'searchString', true, 'email'),
        new ValidationField('name', req.query.name, 'searchString', true, 'name'),
        new ValidationField('lastName', req.query.lastName, 'searchString', true, 'lastName'),
        new ValidationField('nickname', req.query.nickname, 'searchString', true, 'nickname')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) return res.status(400).send(errors);

    let userRights = new UserRights(req.user.id, null, null);
    await userRights.initializeUser();

    let ids = obj['_id'];

    obj['_id'] = await userRights.whatCanRead(ids);

    let [users, usersError] = await handle(User.find(obj).limit(limit).skip(offset).sort({[sortField]: sortType}).lean().exec());

    if (usersError) {
        return res.status(403).send({
            error: usersError
        })
    }

    let [countUsers, countUsersError] = await handle(User.countDocuments(obj).lean().exec());

    if (countUsersError) {
        return res.status(403).send({
            error: countUsersError
        })
    }

    return res.status(200).send({
        data: users.map(el => userObj(el)),
        count: countUsers
    });
}

async function createUser(req, res) {
    /* fields
        * email
        * name
        * lastName
        * nickname
    */

    let {email, name, lastName, nickname, publicKey} = req.body;

    let params = [
        new ValidationField('email', email, 'email', false, 'email'),
        new ValidationField('name', name, 'string', false, 'name'),
        new ValidationField('lastName', lastName, 'string', false, 'lastName'),
        new ValidationField('nickname', nickname, 'nickname', false, 'nickname'),
        new ValidationField('publicKey', publicKey, 'string', false, 'publicKey')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findNickUser, findNickUserError] = await handle(User.findOne({nickname: nickname}).lean().exec());

    if (findNickUserError) {
        return res.status(403).send({
            error: findNickUserError
        })
    }

    if (findNickUser) {
        return res.status(409).send({
            field: 'nickname'
        });
    }

    let [findUser, findUserError] = await handle(User.findOne({email: email}).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (findUser) {
        return res.status(409).send({
            field: 'email'
        });
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

async function getUserInfo(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false)
    ]

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [user, userError] = await handle(User.findById(req.params.id));

    if (userError) {
        return res.status(403).send({
            error: userError
        })
    }

    if (!user) {
        return res.status(404).end();
    }

    let userRights = new UserRights(req.user.id, null, user);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('read');

    if (rights.can) return res.status(rights.status).send(rights.message);

    return res.status(200).send(userObj(user));
}

async function updateUser(req, res) {
    /* fields
        id
        name
        lastName
        email
        profileDescription
        nickname
    */

    let {name, lastName, profileDescription} = req.body;

    let params = [
        new ValidationField('id', req.params.id, 'string', false),
        new ValidationField('name', name, 'string', true, 'name'),
        new ValidationField('lastName', lastName, 'string', true, 'lastName'),
        new ValidationField('profileDescription', profileDescription, 'string', true, 'profileDescription')
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findById(req.params.id).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) {
        return res.status(404).end();
    }

    let userRights = new UserRights(req.user.id, null, findUser);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('change');

    if (rights.can) return res.status(rights.status).send(rights.message);

    let [updatedUser, updatedUserError] = await handle(User.updateOne({_id: req.params.id}, obj).lean().exec());

    if (updatedUserError) {
        return res.status(403).send({
            error: updatedUserError
        })
    }

    return res.status(200).end();
}

async function deleteUser(req, res) {
    let {errors, obj} = FieldsValidator([new ValidationField('id', req.params.id, 'string', false)]);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findById(req.params.id).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) {
        return res.status(404).end();
    }

    let userRights = new UserRights(req.user.id, null, findUser);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('delete');

    if (rights.can) return res.status(rights.status).send(rights.message);

    // TODO delete user traces

    let [deleteUser, deleteUserError] = await handle(User.deleteOne({_id: req.params.id}));

    if (deleteUserError) {
        return res.status(403).send({
            error: deleteUserError
        })
    }

    return res.status(200).end();
}

async function blockUnblockUser(req, res) {
    let {errors, obj} = FieldsValidator([
        new ValidationField('id', req.params.id, 'string', false),
        new ValidationField('status', req.query.status, 'string', false)
    ]);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findOne({_id: req.params.id}).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) return res.status(404).end();

    let userRights = new UserRights(req.user.id, null, findUser);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('block');

    if (rights.can) return res.status(rights.status).send(rights.message);

    let [updateUser, updateUserError] = await handle(User.findByIdAndUpdate(req.params.id, {status: req.query.status}));

    if (updateUserError) {
        return res.status(403).send({
            error: updateUserError
        });
    }

    return res.status(200).end();
}

async function loadImage(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'string', false),
        new ValidationField('file', req.files ? req.files.avatar : null, 'file', false)
    ];

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({errors: errors})
    }

    let [user, userError] = await handle(User.findById(req.params.id).lean().exec());

    if (userError) {
        return res.status(403).send({
            error: userError
        })
    }

    if (!user) {
        return res.status(404).end();
    }

    let userRights = new UserRights(req.user.id, null, user);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('change');

    if (rights.can) return res.status(rights.status).send(rights.message);

    let file = req.files.avatar,
        extension = path.extname(file.name),
        fileName = md5('verylongfilename' + Date.now()),
        avatar = 'uploads/avatar/' + fileName + extension

    await file.mv('./' + avatar);

    let [updatedUser, updatedUserError] = await handle(User.findByIdAndUpdate(req.params.id, {
        avatar: avatar
    }));

    if (updatedUserError) {
        return res.status(403).send({
            error: updatedUserError
        })
    }

    res.status(200).end();
}

async function deleteImage(req, res) {
    let {errors, obj} = FieldsValidator([
        new ValidationField('id', req.params.id, 'string', false)
    ]);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findById(req.params.id).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) return res.status(404).end();

    let userRights = new UserRights(req.user.id, null, findUser);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('change');

    if (rights.can) return res.status(rights.status).send(rights.message);

    let [deleteFile, deleteFileError] = await handle(fsx.remove('./' + findUser.avatar));

    if (deleteFileError) {
        return res.status(403).send({
            error: deleteFileError
        })
    }

    let [updateUser, updateUserError] = await handle(User.updateOne({_id: req.params.id}, {
        avatar: null
    }))

    if (updateUserError) {
        return res.status(403).send({
            error: updateUserError
        })
    }

    return res.status(200).end();
}

async function changeEmail(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'number', false),
        new ValidationField('email', req.body.email, 'email', false)
    ]

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findById(req.params.id).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) return res.status(404).end();

    let userRights = new UserRights(req.user.id, null, findUser);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('change');

    if (rights.can) return res.status(rights.status).send(rights.message);

    let [findUserWithSameEmail, findUserWithSameEmailError] = await handle(User.findOne({email: req.body.email}).lean().exec());

    if (findUserWithSameEmailError) {
        return res.status(403).send({
            error: findUserWithSameEmailError
        })
    }

    if (findUserWithSameEmail) return res.status(409).end();

    let [updateEmail, updateEmailError] = await handle(User.updateOne({_id: req.params.id}, {
        email: req.body.email
    }));

    if (updateEmailError) {
        return res.status(403).send({
            error: updateEmailError
        })
    }

    return res.status(200).end();
}

async function changeNickname(req, res) {
    let params = [
        new ValidationField('id', req.params.id, 'number', false),
        new ValidationField('nickname', req.body.nickname, 'string', false)
    ]

    let {errors, obj} = FieldsValidator(params);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        })
    }

    let [findUser, findUserError] = await handle(User.findById(req.params.id).lean().exec());

    if (findUserError) {
        return res.status(403).send({
            error: findUserError
        })
    }

    if (!findUser) return res.status(404).end();

    let userRights = new UserRights(req.user.id, null, findUser);
    await userRights.initializeUser();

    let rights = await userRights.checkRights('change');

    if (rights.can) return res.status(rights.status).send(rights.message);

    let [findUserWithSameNickname, findUserWithSameNicknameError] = await handle(User.findOne({nickname: req.body.nickname}).lean().exec());

    if (findUserWithSameNicknameError) {
        return res.status(403).send({
            error: findUserWithSameNicknameError
        })
    }

    if (findUserWithSameNickname) return res.status(409).end();

    let [updateNickname, updateNicknameError] = await handle(User.updateOne({_id: req.params.id}, {
        nickname: req.body.nickname
    }));

    if (updateNicknameError) {
        return res.status(403).send({
            error: updateNicknameError
        })
    }

    return res.status(200).end();
}

module.exports = {
    getUsersList,
    createUser,
    getUserInfo,
    updateUser,
    deleteUser,
    blockUnblockUser,
    loadImage,
    deleteImage,
    changeNickname,
    changeEmail
}