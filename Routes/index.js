const
    router = require('express').Router(),
    jwt = require('../Config/jwt');

router.use(jwt.unless({
    path: [
        /\/auth/,
        {url: /\/user/, methods: ['POST']}
    ]
}));

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/room', require('./room'));

module.exports = router;