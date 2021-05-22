const helmet = require('helmet');
const startupDebugger = require('debug')('app:startup');
const dbDebbuger = require('debug')('app:db');
const morgan = require('morgan');
const express = require('express');
const Joi = require('joi');
const logger = require('./middleware/logger');
const app = express();
const courses = require('./routes/courses');
const config = require('config');
const home = require('./routes/home')

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded( {extended: true}));
app.use(logger);
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);


//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development')
{
    app.use(morgan('tiny'));
    startupDebugger('Morgan Enabled..');
}

dbDebbuger('Connected to the database...');

app.use(function(req,res,next) {
    console.log('Authenticating...');
    next();
});


//Port
app.listen(3000, () => console.log('Listening on port 3000...'));
