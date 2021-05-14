const
    router = require('express').Router(),
    {getUsersList, getUserInfo, createUser, updateUser, deleteUser, blockUser, unblockUser} = require('../Controllers/user');

router.get('', getUsersList);
router.get('/:id', getUserInfo);
router.post('', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

router.patch('/:id/block', blockUser);
router.patch('/:id/unblock', unblockUser);

module.exports = router;