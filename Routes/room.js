const
    router = require('express').Router(),
    {getRoomsList, createRoom, roomDetail, deleteRoom, updateUsersList, getRoomWithUser} = require('../Controllers/room');

router.get('/:id/user', getRoomWithUser);
router.get('', getRoomsList);
router.post('', createRoom);
router.get('/:id', roomDetail);
router.patch('/:id', updateUsersList);
router.delete('/:id', deleteRoom);

module.exports = router;