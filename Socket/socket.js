const
    {checkTokenForSocket}       = require('../Utils/socket'),
    mongoose                    = require('../Config/database'),
    User                        = mongoose.model('User'),
    Room                        = mongoose.model('Room');

module.exports = io => {

    io.use(checkTokenForSocket);

    io.on('connection', async socket => {

        socket.join(socket.user.id);

        console.log(socket.user.id + " connected");

        socket.on('joinRoom', (data) => {
            console.log('user joined');
            socket.join(data);
        })

        socket.on('leaveRoom', (data) => {
            console.log('user left');
            socket.leave(data);
        })

        socket.on('disconnect', async () => {
            socket.leave(socket.user.id);
            await User.findByIdAndUpdate(socket.user.id, {onlineStatus: 'offline'});
        })
    });
};