const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Brand } = require("../../model/brand/brand")



const viewAllBrands = async(req,res,next)=>{
    try {
        const mBrand = await Brand.findBrand();
         if (mBrand&&mBrand.length>0) {
            httpResponse({status_code:200, response_message:'Brand successfully fetched',data:mBrand,res});  
         } else {
            const err = new HttpError(404, 'You have not added any product brand. Please add brands');
            return next(err); 
         }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    viewAllBrands
}