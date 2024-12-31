

const { product} = require("../../model/products/products");

const { httpResponse } = require("../../middlewares/http/http-response");
const { HttpError } = require("../../middlewares/errors/http-error");
const mongoose= require("mongoose");
const deleteProduct = async function deleteOfProduct(req,res,next){
    try {
        const {id} = req.params;
        const mproduct = await product.deleteProduct(id);
        if (mproduct) {
            httpResponse({status_code:200, response_message:'Product deleted', data:mproduct,res});
        }else{
            const e = new HttpError(400, "Unable to delete this product. Contact support if persists");
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    deleteProduct
}