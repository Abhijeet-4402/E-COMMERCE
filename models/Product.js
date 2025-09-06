const mongoose  = require("mongoose");
const Review = require("../models/Review");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    img: {
        type: String,
        trim:true,
        // default:  ,
        required: true
    },
    price:{
        type: Number,
        min: 0,
        required: true
    },
    desc:{
        type: String,
        trim: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//middleWare jo behind the scene MongoDB operations krwane pr use hote hai and inke andr pre and post middleWare hote hai
//jo basically model bnane ke phle schema pr use hote hai.

productSchema.post('findOneAndDelete', async function(product){
    if(product.reviews.length>0){
        await Review.deleteMany({_id:{$in:product.reviews}})
    }
})


let Product = mongoose.model('Product', productSchema);

module.exports = Product;