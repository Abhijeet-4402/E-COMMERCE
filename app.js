

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const seedDB = require('./seed');
const productRoutes = require('./routes/product');
const methodOverride = require('method-override');
const reviewRoutes = require('./routes/review');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cartRoutes = require('./routes/cart');
const User = require('./models/User');
const mongoose = require('mongoose');
const cors = require('cors');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/ecommerce_app';
mongoose.connect(dbUrl)
    .then(() => {
        console.log("DB connected sucessfully");
        app.listen(8080, () => {
            console.log(`Sever connected at port 8080`)
        })
    })
    .catch((err) => {
        console.log("DB error");
        console.log(err);
    })



// const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// ...

// CORS configuration for React Frontend
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(helmet()); // Secure HTTP headers
// app.use(mongoSanitize()); // Prevent NoSQL Injection - Disabled due to Express 5 incompatibility


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Allow parsing JSON bodies
app.use(methodOverride('_method'));


let configsession = {
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 24 * 7 * 60 * 60 * 1000,
        maxAge: 24 * 7 * 60 * 60 * 1000
    }
}

app.use(session(configsession));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Remove res.locals middleware for flash messages as we are using JSON

// Routes
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

// seedDB(); 


// Global Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});



























