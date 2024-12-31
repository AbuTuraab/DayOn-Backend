const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Brand } = require("../../model/brand/brand")




const updateBrand= async(req,res,next)=>{
    try {
        const {brandId} = req.params
        const {brand_name} = req.body;
         if (!brandId) {
          const e = new HttpError(400, 'Provide a brandId');
          return next(e);
         }
         const data ={
             brand_name
         }
        const updatedBrand =await Brand.updateBrand(brandId,data);
        if (updatedBrand) {
            httpResponse({status_code:200, response_message:'Brand successfully updated', data:{}, res});
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e); 
    }
}


module.exports={
    updateBrand
}