const mongoose = require('mongoose');
require('dotenv').config();

const dataBaseConnection =  mongoose.connect("mongodb+srv://abhinavshakya1608:xknzf9U2RufEqN4e@cluster0.sejhqa6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("DataBase connected successfully");
}).catch((e)=>{
    console.log(e.message);
})

module.exports = dataBaseConnection;