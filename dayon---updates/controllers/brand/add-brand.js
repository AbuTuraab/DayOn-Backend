const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { brandFieldValidation, Brand } = require("../../model/brand/brand")


const addBrand = async(req,res,next)=>{
    try {
        const mBrand = await brandFieldValidation.validateAsync(req.body);
        const brandExists = await Brand.findBrandByName(mBrand.brand_name);
        if (brandExists) {
            const e = new HttpError(400, 'This brand already exists');
            return next(e);
        }
        const addNewBrand = Brand.createBrand(mBrand);
        addNewBrand.save().then((b)=>{
        httpResponse({status_code:200, response_message:'Product brand successfully added',data:b,res});
        }).catch((err)=>{
            const e = new HttpError(400, err.message);
            return next(e);
        });
    } catch (error) {
        joiError(error,next);
    }
}


module.exports={
    addBrand
}