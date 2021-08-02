const
    mongoose = require('mongoose'),
    config = require('./config.json');

require('mongoose-moment')(mongoose);

mongoose.model('Room',      require('../Models/room'));
mongoose.model('User',      require('../Models/user'));
mongoose.model('ChatUser', require('../Models/chatUser'));
mongoose.model('Message',   require('../Models/message'));
mongoose.model('Logs',      require('../Models/logs'));

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    promiseLibrary: global.Promise,
    // ssl: true // for remote server only
})
    .then(() => {
        console.log('connected successfully');
    }).catch(error => {
        throw Error("connect to db is impossible because: " + error);
    })

module.exports = mongoose;