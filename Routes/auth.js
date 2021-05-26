const
    router = require('express').Router(),
    {auth, sendCode} = require('../Controllers/auth');

router.post('', auth);
router.post('/send-code', sendCode);

module.exports = router;