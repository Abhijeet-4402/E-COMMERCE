const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedDB = require('./seed');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const flash = require('connect-flash');
const session = require('express-session');



mongoose.connect('mongodb://127.0.0.1:27017/shopping-sam-app')
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log("ERROR => ", err);
    })



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');  // change view engine to ejs
app.set('views', path.join(__dirname, 'views'));  // connect views folder
app.use(express.static(path.join(__dirname, 'public')));// connect public folder
app.use(express.urlencoded({ extended: true })); // middleWare for parsing incoming request.
app.use(methodOverride('_method')); // for overriding form method like put patch delete

let sess = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}
app.use(session(sess));
app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//Seeding DataBase: 
// seedDB();

//Saare middlewares iske phle use krna hai
app.use(productRoutes); // So that har incoming request ke liye path check kiya jaye.
app.use(reviewRoutes);  // So that har incoming request ke liye path check kiya jaye.

app.listen(8080, () => {
    console.log("Server Connected at port 8080");
})