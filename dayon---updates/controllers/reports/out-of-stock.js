const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products")



const fetchOutOfStock = async(req,res,next)=>{
    try {
        const {branch_id} = req.userData
        const mProduct = await product.findProducts(branch_id);
        if (mProduct) {
         const outOfStock = mProduct.filter(products=>products.current_product_quantity==0);
         if (outOfStock.length>0) {
             
            httpResponse({status_code:200, response_message:'Available', data:{outOfStock}, res});
         }else{
             const e = new HttpError(400, 'No product is out of stock at the moment');
             return next(e);
         }
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);       
    }
}

module.exports={
    fetchOutOfStock
}