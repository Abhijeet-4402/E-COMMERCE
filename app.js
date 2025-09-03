const path =require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedDB = require('./seed');
const productRoutes = require('./routes/product');

mongoose.connect('mongodb://127.0.0.1:27017/shopping-sam-app')
.then(()=>{
    console.log("DB connected successfully");
})
.catch((err)=>{
    console.log("ERROR => ",err);
})


app.set('view engine', 'ejs');  // change view engine to ejs
app.set('views', path.join(__dirname,'views'));  // connect views folder
app.set(express.static(path.join(__dirname,'public')));  // connect public folder

//Seeding DataBase: 
// seedDB();

app.use(productRoutes); // So that har incoming request ke liye path check kiya jaye.

app.listen(8080, ()=>{
    console.log("Server Connected at port 8080");
})