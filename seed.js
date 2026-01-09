
//connecting to db for giving initial product
const mongoose=require('mongoose');

// hume initial product model m insert krna h jiska name product hai using InsertMany
const Product = require('./models/Product');

//creating array of products
let Products=[   
    {
        name:"Iphone 14 pro",
        img:"https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D",
        price:13000000,
        desc:"teri aukaat se bhar h bhut costly h re baba",
       
    },
    {
        name:"Iphone 14 pro",
        img:"https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG1vYmlsZSUyMHBob25lfGVufDB8fDB8fHww",
        price:189000000,
        desc:"teri aukaat se bhar h bhut costly h re baba"
        
    },
    {
        name:"Apple",
        img:"https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vYmlsZSUyMHBob25lfGVufDB8fDB8fHww",
        price:12312312,
        desc:"chl chl tujhe toh lunga hi"
        
    },
    {
        name:"Vivo",
        img:"https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D",
        price:17000000,
        desc:"teri aukaat se bhar h bhut costly h re baba"
        
    },
    {
        name:"oppo",
        img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D",
        price:120000,
        desc:"wow bete acchi tarkki pr ho"
        
    }
]

//note all the functions related to db like insertMany n etc always return promises ya toh yeh hoga ya toh nhi hoga that is then and catch
//promise ki chainning se bachne k liye hum asyn await use krte h

async function seedDB(){
    await Product.insertMany(Products);
    console.log("data seeded sucessfully");
}

//exporting this file-->
module.exports=seedDB;
