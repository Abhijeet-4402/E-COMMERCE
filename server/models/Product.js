const mongoose = require('mongoose');
const Review = require('./Review');

//creating schema
let ProductSchema = new mongoose.Schema({//accpescts an object

    //here we define humre product ka schema kesa nazar ayega
    name: {
        type: String,
        trim: true,     //trim white space
        required: true   //required means ky yeh mandatatoy hai?
    },
    img: {
        type: String,
        trim: true,
        // default:           //img ka default path
    },
    price: {
        type: Number,
        min: 0,
        required: true

    },
    desc: {
        type: String,
        trim: true
    },
    avgRating: {
        type: Number,
        default: 0
    },
    reviews: [  //ek product k multiple reviews ho skte h so array m rkh rhe
        //yaha pe hum Review model ka reference rkh rhe.ki ek review kis type ka hoga
        {
            type: mongoose.Schema.Types.ObjectId, //yeh ek special type h jo mongoose provide krta h for id for referencing 
            ref: 'Review'   //refering to Review model .tells konse model ke reference ki baat kr rhe h .objectId konsa model se uthani h
        }
    ],
    author: {  //ek product ka ek hi author ho skta h.isliye isme reviews ki trh array daalne ki jrurt nhi hogi.
        //author k liye user ka collection bna rkha h.vha se id milegi.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


//schema k baad  aur model se pehle middleware use krenge
//using middleware jo behind the secne mongodb operations krwane par use hota hai and iske andr pre and post middleware hote h which are basically used over the schema and before the model .model is js class
ProductSchema.post('findOneAndDelete', async function (product) {
    if (product && product.reviews.length > 0) {  //agr product k andr reviews ka length hoga mtlb reviews honge hi
        await Review.deleteMany({ _id: { $in: product.reviews } }) //jo reviews k andr id hongi unhe delete krdenge.id match kr jaye product k andr reviews se toh dlt krde
    }
})



//now create model->of product with the help of product schema
let Product = mongoose.model('Product', ProductSchema);

//do file k beech content ko exchange k liye export krna hoga

module.exports = Product;










