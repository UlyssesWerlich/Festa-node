var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const routes = require('./routes/routes');

const passport = require('passport')  
require('./auth')(passport);
const session = require('express-session')  
const MongoStore = require('connect-mongo')(session)

var sessionStore = new MongoStore({
  host: '127.0.0.1',
  port: '27017',
  db: 'sistema_aluguel_festa',
  url: 'mongodb://localhost:27017/demo'
});

app.use(session({  
  store: sessionStore,
  secret: '123',//configure um segredo seu aqui
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
