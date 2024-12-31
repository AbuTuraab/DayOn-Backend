const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Brand } = require("../../model/brand/brand");

const joi = require('joi');

const fieldValidation = joi.object({
    brandId : joi.string().required()
})


const deleteProductBrand = async(req,res,next)=>{
    try {
        const {brandId} = req.params;
        const m =await fieldValidation.validateAsync(req.parans)
        const deletedBrand =await Brand.deleteBrand(brandId);

        if (deletedBrand) {
         httpResponse({status_code:200, response_message:'Brand successfully deleted', data:deletedBrand,res});   
        } else {
            const e = new HttpError(400, 'Something went wrong unable to delete brand');
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    deleteProductBrand
}