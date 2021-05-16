const
    router = require('express').Router(),
    jwt = require('../Config/jwt');

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));

module.exports = router;