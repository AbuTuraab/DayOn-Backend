const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");
const { Purchase } = require("../../model/Purchases/purchase")





const  deletePurchase = async function deletePurchase(req,res,next){
    try {
        const {id}  = req.params 
      const deletedPurchase = await Purchase.deletePurchase(id);
      if (deletedPurchase) {
      const findProduct = await product.findOne({_id:deletedPurchase.product_id})
        const data = {
            current_product_quantity: findProduct.current_product_quantity - Number(deletedPurchase.purchase_quantity),
            previous_product_quantity: findProduct.current_product_quantity
        }
        product.updateProduct(deletedPurchase.product_id,data).then(async(updated)=>{
            httpResponse({status_code:200, response_message:"Purchase successfully updated", data:{}, res});
             return;
         }).catch((e)=>{
             const err = new HttpError(500, e.message);
             return next(err);
             });
      }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    deletePurchase
}