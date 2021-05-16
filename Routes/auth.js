const
    router = require('express').Router(),
    {auth} = require('../Controllers/auth');

router.post('', auth);

module.exports = router;