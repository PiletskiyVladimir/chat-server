function GetRights (currentUser, userToEdit) {
    return currentUser._id === userToEdit._id || currentUser.role === 'admin';
}

function IsAdmin (user) {
    return user.role === 'admin';
}

function IsCurrentUser (currentUser, userToEdit) {
    return currentUser._id === userToEdit._id;
}

module.exports = {
    GetRights,
    IsAdmin,
    IsCurrentUser
}