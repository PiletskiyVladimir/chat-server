const
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

app.use(fileUpload({
    // debug: true,
    parseNested: true,
    abortOnLimit: true,
    limits: { fileSize: 20 * 1024 * 1024 }
}));

app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.text());

app.use(logger('dev'));

app.use(cors());

app.get('/', (req, res) => {
    res.send('App is working');
})

app.use(
    queryParser({
        parseNull: true,
        parseBoolean: true
    })
)

app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./Routes'));

app.all('*', (req, res) => {
    res.status(404).send({
        err: "Path or method are wrong"
    });
});

server.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
});

const io = socketIo(server, {
    cors: {
        origin: '*',
    },
    path: "/socket.io"
});

io.on('connection', socket => {
    // TODO
})

// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//     // The standard secure default length for RSA keys is 2048 bits
//     modulusLength: 2048,
// });
//
// console.log(publicKey, privateKey);

app.locals.io = io;