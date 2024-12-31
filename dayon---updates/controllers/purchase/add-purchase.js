

const joi = require('joi');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { product } = require('../../model/products/products');
const { Purchase } = require('../../model/Purchases/purchase');

const fieldValidation = joi.object({
    purchase_date: joi.date().required(),
    branch:joi.string().required(),
    items: joi.array(),
    invoice_number: joi.string().required(),
    discount:joi.string() 
});

const addPurchase = async(req,res,next)=>{
    try {
        const mPurchase = await fieldValidation.validateAsync(req.body);
        const {branch_id} = req.userData
        for (let index = 0; index < mPurchase.items.length; index++) {
            const products = await product.findOne({_id:mPurchase.items[index].product});
           const datas = {
            purchase_date: `${mPurchase.purchase_date}Z`,
            branch:mPurchase.branch,
            created_at:`${mPurchase.items[index].created_at}Z`,
            product_id: mPurchase.items[index].product,
            invoice_number: mPurchase.items[index].invoice_number,
            supplier: mPurchase.items[index].supplier,
            product: products.product_name,
            purchase_quantity: mPurchase.items[index].purchase_quantity,
            discount: mPurchase.items[index].discount,
            total_purchase_value: mPurchase.items[index].total_purchase_value,
            
           }
           const mProduct = await product.findProduct(mPurchase.items[index].product, branch_id);
           if (mProduct) {   
               const data ={
                 current_product_quantity: mProduct.current_product_quantity + Number(mPurchase.items[index].purchase_quantity),
                 previous_product_quantity: mProduct.current_product_quantity 
               }
            product.updateProduct(mPurchase.items[index].product,data).then(async(updated)=>{
            const newPurchase =await  Purchase.addPurchase(datas);
            newPurchase.save().then((purchased)=>{
           httpResponse({status_code:201, response_message:"Purchase successfully added", data:purchased, res});
            }).catch((e)=>{
                const err = new HttpError(500, e.message);
                return next(err);
            });
            }).catch((err)=>{
            const e = new HttpError(400, err.message);
            return next(e)
            });
        }
    }
    } catch (error) {
        joiError(error, next);
    
    }
}


module.exports={
    addPurchase
}