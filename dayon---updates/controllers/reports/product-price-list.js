const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products")



const fetchProductPrice = async(req,res,next)=>{
    try {
        const {branch_id} = req.userData;
        const mProduct = await product.findProducts(branch_id);
        if (mProduct) {
         httpResponse({status_code:200, response_message:'Product available', data:{mProduct},res});   
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);       
    }
}

const stockLevel = async(req,res,next)=>{
    try {
        const {branch} = req.query;
        const mProduct = await product.findProducts(branch);
        if (mProduct) {
         httpResponse({status_code:200, response_message:'Product available', data:{mProduct},res});   
        }else{
            const e = new HttpError(404, "You don't have product in this branch");
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);       
    }
}

module.exports={
    fetchProductPrice,
    stockLevel
}