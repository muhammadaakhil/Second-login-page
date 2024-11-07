const express = require('express');
const morgan = require('morgan');
const app = express();
const hbs = require('hbs');
const nocache = require('nocache');
const session = require('express-session');

app.use(express.static('public'));
app.set('view engine', 'hbs')

app.use(morgan('tiny'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoute = require('./Routes/user');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(nocache());

app.use('/', userRoute);


app.listen(3005, () => {
    console.log('server running at the 3005 port');
})