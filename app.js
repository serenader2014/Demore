var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var config = require('./config');

var app = module.exports.app = express();

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to mongodb failed.');
        process.exit(1);
    }
});


var routes = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', config.port);

app.use(bodyParser.json());
app.use(bodyParser());
app.use(cookieParser());
app.use(logger('dev'));


app.use(session({
    name: 'demo session',
    secret: config.session_secret,
    store: new MongoStore({
        url: config.db
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function () {
    console.log('Demore is listening on port ' + app.get('port'));
});

routes(app);