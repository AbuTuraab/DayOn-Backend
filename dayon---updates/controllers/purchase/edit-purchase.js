

const { HttpError } = require('../../middlewares/errors/http-error');
const { Purchase } = require('../../model/Purchases/purchase');
const { product } = require('../../model/products/products');
const { httpResponse } = require('../../middlewares/http/http-response');


const editPurchase = async function editPurchase(req,res,next){
    try {
        let {
            purchase_date,
            branch,
            invoice_number,
            supplier,
            product_name,
            purchase_quantity,
            discount,
            total_purchase_value,
           } = req.body
        const {id} = req.params;
        if (!id) {
            const e = new HttpError(400, "Please provide an id");
            return next(e);
        }
        let myPurchase;
            if (purchase_quantity< 1) {
                myPurchase = -(purchase_quantity)
            }else{
                myPurchase = purchase_quantity
            }
           const data = {
            purchase_date,
            branch,
            invoice_number,
            supplier,
            product:product_name,
            purchase_quantity:myPurchase,
            discount,
            total_purchase_value,
           }
        const updatedPurchase = await Purchase.editPurchase(id, data);
        if (updatedPurchase) {
            if (purchase_quantity!=null|| "") {
                const findProduct = await product.findOne({_id:updatedPurchase.product_id})
                const data = {
                    current_product_quantity: findProduct.current_product_quantity + Number(purchase_quantity),
                    previous_product_quantity: findProduct.current_product_quantity
                }
                product.updateProduct(updatedPurchase.product_id,data).then(async(updated)=>{
                   httpResponse({status_code:200, response_message:"Purchase successfully updated", data:{}, res});
                    return;
                }).catch((e)=>{
                    }).catch((err)=>{
                    const e = new HttpError(400, err.message);
                    return next(e)
                    });
            }else{
                httpResponse({status_code:200, response_message:"Purchase successfully updated", data:{}, res});
            }
            httpResponse({status_code:200, response_message:"Purchase successfully updated", data:{}, res});
        }
    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);       
    }
}


module.exports={
    editPurchase
}