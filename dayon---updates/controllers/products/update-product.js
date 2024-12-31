const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products");
const joi = require('joi');
const joiError = require("../../middlewares/errors/joi-error");

const fieldValidation = joi.object({
  productId: joi.string().required()
});

const updateProducts =async(req,res,next)=>{
    try {
      const {price,  product_barcode,product_name,supplier,selling_price} = req.body;
      const {branch_id} = req.userData;
      const pValidation = await fieldValidation.validateAsync(req.params);
      const mproduct = await product.findProduct(pValidation.productId,branch_id);
      if (mproduct) {
        const data ={
          product_price:price,
          selling_price,
          product_name,
          product_barcode,
          supplier 
        }  

        const updatedProduct = await product.updateProduct(pValidation.productId, data);
        if (updatedProduct) {
            httpResponse({status_code:200, response_message:'Product successfully updated',data:updatedProduct,res});
        }else{
            const err = new HttpError(500, 'Unable to update products. Please contact support if persists');
            return next(err);
        }
      }else{
        const err = new HttpError(400, 'No products is associated to this productId');
        return next(err);
      }    
    } catch (error) {
      joiError(error,next);
    }
}

const BalanceStockLevel =async(req,res,next)=>{
  try {
    const {quantity} = req.body;
    const {branch_id} = req.userData;
      if (typeof quantity!="number") {
        const e = new HttpError(400, "quantity must be  a typeof number");
        return next(e);
      }
      const fieldValidation = joi.object({
        id: joi.string().required()
      });
    const pValidation = await fieldValidation.validateAsync(req.params);
    const mproduct = await product.findProduct(pValidation.id, branch_id);
    if (mproduct) {
      const data ={
        current_product_quantity: quantity,
        previous_product_quantity: mproduct.current_product_quantity 
      }  
      const updatedProduct = await product.updateProduct(pValidation.id, data);
      if (updatedProduct) {
          httpResponse({status_code:200, response_message:'Stock level successfully balanced',data:updatedProduct,res});
      }else{
          const err = new HttpError(500, 'Unable to update products. Please contact support if persists');
          return next(err);
      }
    }else{
      const err = new HttpError(400, 'No products is associated to this productId');
      return next(err);
    }    
  } catch (error) {
      joiError(error,next);
  }
}

module.exports={
    updateProducts,
    BalanceStockLevel
}