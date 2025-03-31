const express  = require("express");
const mongoose = require("mongoose");

const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const expressLayouts = require("express-ejs-layouts");
const dataBaseConnection = require('./server/models/database.js')

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret:'CookingBlogSecureSession',
    saveUninitialized:true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js');
app.use('/',routes);

app.listen(PORT , ()=>{
    console.log(`Listening to port ${PORT}`);
})



