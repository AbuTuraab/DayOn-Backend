const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products")




const viewAllProducts = async(req,res,next)=>{
    try {
      const {branch_id} = req.userData;
        const mProducts = await product.findProducts(branch_id);
        const branchProduct = mProducts.filter(p=>p.branch==branch_id);
        if (mProducts) {
          httpResponse({status_code:200,response_message:'Product fetched',data:branchProduct.sort((a,b)=>{
            const fa = a.product_name.toLowerCase()
           const  fb = b.product_name.toLowerCase();
           if (fa<fb) {
             return -1;
           }else if(fa>fb){
             return 1
           }else{
             return 0
           }
         }),res}); 
        }
    } catch (error) {
        const err = new HttpError(500, error.message);
        return next(err);
    }
}

const viewSingleProduct = async(req,res,next)=>{
    try {
      const {product_barcode} = req.params;
      const {branch_id} = req.userData;
      if (!product_barcode) {
        const err = new HttpError(400, 'Please supply product barcode');
        return next(err);
      }  
      const mProduct = await product.findProductByBarcode(product_barcode, branch_id);
      if (mProduct) {
        httpResponse({status_code:200, response_message:'Product available',data:mProduct,res});  
      }else{
        const err = new HttpError(400, 'No product found for product barcode');
        return next(err);   
      }
    } catch (error) {
        const err = new HttpError(500, error.message);
        return next(err);
    }
}


const viewSingleProductById = async(req,res,next)=>{
  try {
    const {id} = req.params;
    const {branch_id} = req.userData;
    if (!id) {
      const err = new HttpError(400, 'Please supply product id');
      return next(err);
    }  
    const mProduct = await product.findProduct(id, branch_id);
    if (mProduct) {
      httpResponse({status_code:200, response_message:'Product available',data:mProduct,res});  
    }else{
      const err = new HttpError(400, 'No product found for product id');
      return next(err);   
    }
  } catch (error) {
      const err = new HttpError(500, error.message);
      return next(err);
  }
}

module.exports={
    viewAllProducts,
    viewSingleProduct,
    viewSingleProductById
}