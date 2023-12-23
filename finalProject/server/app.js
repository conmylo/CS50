let express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

let app = express();
app.use(bodyParser.json({
    limit: '80mb'
}));

app.use(bodyParser.urlencoded({
    limit: '80mb',
    extended: true
}));

const itemRoutes = require('./routes/item');
const listRoutes = require('./routes/list');
const userRoutes = require('./routes/user');

http.createServer(app.handle.bind(app)).listen(3000, '0.0.0.0', () => {
    console.log(`HTTP is listening in PORT = 3000`);
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');

    res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET');

    console.log(req.url);

    next();
});


app.use('/api/item', itemRoutes);
app.use('/api/list', listRoutes);
app.use('/api/user', userRoutes);

//If Endpoint doesn't exist return NOT FOUND
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});


module.exports = app;
