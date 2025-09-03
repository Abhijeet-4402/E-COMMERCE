const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        name: 'I-Phone 14 Pro',
        img: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price:130000,
        desc: 'Very costly, Aukaat ke bahar'
    },
    {
        name:'MacBook M2 Pro',
        img: 'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 250000,
        desc: 'ye to bilkul hi aukaat ke bahar hai '
    },
    {
        name:'Apple Watch',
        img: 'https://images.unsplash.com/photo-1553103291-a40940bedc81?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 51000,
        desc: ' ye sasta hai le lo'
    },
    {
        name:'I-Pad pro',
        img: 'https://images.unsplash.com/photo-1661340272675-f6829791246e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 237000,
        desc: 'Rhne de nhi le paayega'
    },
    {
        name:'Airpods Pro',
        img: 'https://images.unsplash.com/photo-1587523459887-e669248cf666?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 25000,
        desc: 'Kuch chije sirf dekhne ke liye hoti hai'
    }
];

async function seedDB(){
    await Product.insertMany(products);
    console.log('Data Seeded Successfully');
    
}

module.exports = seedDB;