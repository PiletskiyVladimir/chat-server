const
    mongoose = require('./Config/database'),
    Logs = mongoose.model('Logs'),
    {queryParser} = require('express-query-parser'),
    fileUpload  = require('express-fileupload'),
    crypto = require('crypto'),
    path = require('path'),
    socketIo = require('socket.io'),
    express = require('express'),
    http = require('http'),
    config = require('./Config/config.json'),
    logger = require('morgan'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    port = config.port,
    app = express(),
    server = http.createServer(app);

const io = socketIo(server, {
    path: "/socket.io"
});

require('./Socket/socket')(io);

app.io = io;

app.use(fileUpload({
    createParentPath: true,
    parseNested: true
}));

app.use('/uploads', express.static('./uploads'));

app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.text());

app.use(logger('dev'));

app.use(cors());

app.get('/', (req, res) => {
    res.send('App is working');
})

app.use('/', require('./Routes/index'));

app.use(
    queryParser({
        parseNull: true,
        parseBoolean: true
    })
)

app.all('*', (req, res) => {
    res.status(404).send({
        err: "Path or method are wrong"
    });
});

app.use(async function (err, req, res, next) {
    console.log("==========================ERROR IN ROUTE==========================");
    console.error(err.stack);
    let status = err.status || 500;
    await Logs.create({message: err.message, status: err.status, body: err.body});
    res.status(status);
    res.json({
        status: status,
        message: err.message,
        code: err.code,
        errorBody: err.errorBody
    });
    console.log("=================================================================");
});

server.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
});