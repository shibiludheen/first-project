const express = require('express')
const path  = require('path')
const nocache = require('nocache')
const logger =  require('morgan')
const ejs = require('ejs')
const userRouter = require('./routes/user')
const env = require('dotenv')
const adminRouter = require('./routes/admin')
const session =  require('express-session')


env.config()
var app = express();
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs')
var db = require('./database/connection')
db.connect()
app.use(session({secret:'key',resave:false,saveUninitialized:false,cookie:{maxAge:10000000}}))
app.use(express.urlencoded({extended:false}))
app.use(nocache())
app.use('/',userRouter)
app.use('/',adminRouter)
app.use(function(req, res) {
    res.status(404);
    res.render('users/errorPage' );
  });



module.exports = app;





 
 
