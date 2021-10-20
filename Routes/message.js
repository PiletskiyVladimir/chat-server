const router = require('express').Router();
const {createMessage, changeMessage, deleteMessage, getMessagesList, messageDetail, getMessagesFromRoom} = require('../Controllers/message');

router.get('',              getMessagesList);
router.get('/:id',          messageDetail);
router.get('/:id/room',     getMessagesFromRoom);
router.post('',             createMessage);
router.patch('/:id',        changeMessage);
router.delete('/:id',       deleteMessage);

module.exports = router;