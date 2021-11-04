const
    router = require('express').Router(),
    jwt = require('../Config/jwt');

router.use(jwt.unless({
    path: [
        /\/uploads/,
        /\/auth/,
        {url: /\/user/, methods: ['POST']}
    ]
}));

router.use('/user',             require('./user'));
router.use('/auth',             require('./auth'));
router.use('/room',             require('./room'));
router.use('/message',          require('./message'));

module.exports = router;