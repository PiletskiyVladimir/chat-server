const
    router = require('express').Router(),
    {getRoomsList, createRoom, roomDetail, deleteRoom, updateUsersList} = require('../Controllers/room');

router.get('', getRoomsList);
router.post('', createRoom);
router.get('/:id', roomDetail);
router.patch('/:id', updateUsersList);
router.delete('/:id', deleteRoom);

module.exports = router;