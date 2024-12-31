const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");
const { Sales } = require("../../model/sales/sales")




const deleteSale = async function deleteSale(req,res,next){
    try {
        const {id}= req.params;
        const {branch_id} = req.userData;
        if (!id) {
            const e = new HttpError(400, "please supply id");
            return next(e);
        }
        /****product should increase by the quantity in d sales deleted */
        const mSales = await Sales.deleteSales(id, branch_id);
        if (mSales) {
            const findProduct = await product.findOne({_id:mSales.product_id})
            const data = {
                current_product_quantity: findProduct.current_product_quantity + Number(mSales.quantity),
                previous_product_quantity: findProduct.current_product_quantity
            }
            product.updateProduct(mSales.product_id,data).then(async(updated)=>{
                httpResponse({status_code:200, response_message:"Sales successfully deleted", data:{}, res});
                 return;
             }).catch((e)=>{
                 const err = new HttpError(500, e.message);
                 return next(err);
                 });
        }else{
            const e = new HttpError(500, "Unable to delete sales. Contact support if persists");
            return next(e);
        }

    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);
    }
}


module.exports={
    deleteSale
}