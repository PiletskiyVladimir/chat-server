const
    router = require('express').Router(),
    {getUsersList, getUserInfo, createUser, updateUser, deleteUser, blockUnblockUser, deleteImage, loadImage, changeEmail, changeNickname} = require('../Controllers/user');

router.get('', getUsersList);
router.get('/:id', getUserInfo);
router.post('', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/block-unblock', blockUnblockUser);

router.patch('/:id/email', changeEmail);
router.patch('/:id/nickname', changeNickname);

router.route('/:id/image')
    .patch(loadImage)
    .delete(deleteImage);

module.exports = router;