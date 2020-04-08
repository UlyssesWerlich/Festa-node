const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(routes);

module.exports = app;