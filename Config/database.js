const mongoose = require('mongoose'),
    config = require('./config.json');

require('mongoose-moment')(mongoose);

mongoose.model('Room',      require('../Models/room'));
mongoose.model('User',      require('../Models/user'));
mongoose.model('ChatUser',  require('../Models/chatUser'));
mongoose.model('Message',   require('../Models/message'));

mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connected successfully');
    }).catch(error => {
        throw Error("connect to db is impossible because: " + error);
    })

module.exports = mongoose;