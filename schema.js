//Schema for server side validation
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(), //yeh model k schema k keys ko server sidepr validate krta h
    img: Joi.string().required(),
    price: Joi.number().min(0).required(),
    desc: Joi.string().required()


})
//diiference in reqiure and import is that require is used in commonjs module system whereas import is used in es6 module system



const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(), //yeh model k schema k keys ko server sidepr validate krta h
    comment: Joi.string().required()



})

module.exports = { productSchema, reviewSchema };
