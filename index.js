const
    {queryParser} = require('express-query-parser'),
    socketIo = require('socket.io'),
    express = require('express'),
    http = require('http'),
    config = require('./Config/config.json'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    port = config.port,
    app = express(),
    server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.text());

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

app.locals.io = io;