const
    {checkTokenForSocket}       = require('../Utils/socket'),
    mongoose                    = require('../Config/database'),
    User                        = mongoose.model('User'),
    Room                        = mongoose.model('Room');

module.exports = io => {

    io.use(checkTokenForSocket);

    io.on('connection', async socket => {



        socket.on('disconnect', async () => {
            for (let room of rooms) {
                socket.leave(room);
            }
            await User.findByIdAndUpdate(socket.user.id, {onlineStatus: 'offline'});
        })
    });
};