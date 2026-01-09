const mongoose = require('mongoose');

//creating schema
let reviewSchema = new mongoose.Schema({//accpects an object

    //here we define humre Review ka schema kesa nazar ayega
    rating: {
        type: Number,
        min: 0,
        max: 5
    },

    comment: {
        type: String,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true }  //to knowthe time when review is created n updated

)

//now create model->of Review with the help of Review schema
let Review = mongoose.model('Review', reviewSchema);


//do file k beech content ko exchange k liye export krna hoga
module.exports = Review;










