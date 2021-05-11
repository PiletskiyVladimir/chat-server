const
    express =           require('express'),
    config =            require('./Config/config.json'),
    cors =              require('cors'),
    bodyParser =        require('body-parser'),
    port =              config.port,
    app =               express();

app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.text());

app.use(require('cors')());

app.get('/', (req, res) => {
    res.send('Кто прочетал тот жопа');
})

app.use('/', require('./Routes'));

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
});

app.all('*', function(req, res){
    res.status(404).send({
        err: "Path or method are wrong"
    });
});