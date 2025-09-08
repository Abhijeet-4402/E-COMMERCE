const { productSchema, reviewSchema } = require("./schema");

const validateProduct = (req, res, next) => {
    let { name, img, price, desc } = req.body;
    let { error } = productSchema.validate({ name, img, price, desc });
    if (error) {
        return res.render('error', { err: error.message });
    }
    next();
}
const validateReview = (req, res, next) => {
    let { rating, comment } = req.body;
    let { error } = reviewSchema.validate({ rating, comment });
    if (error) {
        return res.render('error', { err: error.message });
    }
    next();
}

module.exports = {validateProduct, validateReview};