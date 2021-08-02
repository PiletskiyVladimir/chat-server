const
    {checkTokenForSocket}       = require('../Utils/socket'),
    mongoose                    = require('../Config/database'),
    User                        = mongoose.model('User'),
    Room                        = mongoose.model('Room'),
    ChatUser                    = mongoose.model('ChatUser');

module.exports = io => {

    io.use(checkTokenForSocket);

    io.on('connection', async socket => {
        let userId = socket.user.id;

        let chatUsers = await ChatUser.find({user: userId}).lean().exec();

        let rooms = chatUsers.map(el => el.room);

        for (let room of rooms) {
            socket.join(room);
        }
    });
};