// Schema for Server Side Validation.

const Joi = require('joi');
const productSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    img: Joi.string()
        .min(3)
        .required(),
    price: Joi.string()
        .min(0)
        .required(),
    desc: Joi.string().required()
})

const reviewSchema = Joi.object({
    rating: Joi.string().min(0).max(5).required(),
    comment: Joi.string().required()
})

module.exports = { productSchema, reviewSchema };