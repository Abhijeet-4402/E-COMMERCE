const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//creating schema
let userSchema=new mongoose.Schema({

    //here we define humre User ka schema kesa nazar ayega
     email:{
        type:String,
        trim:true,
        required:true
     },
     role:{
      type:String,
      required:true
     },
     cart:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:'Product' //refernce h Product ka schema
      }
   ]

} ) 


userSchema.plugin(passportLocalMongoose);

//now create model->of User with the help of Review schema
let User=mongoose.model('User',userSchema);


//do file k beech content ko exchange k liye export krna hoga
module.exports=User;










