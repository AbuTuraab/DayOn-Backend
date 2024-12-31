const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Supplier, supplierFieldValidation } = require("../../model/supplier/supplier")




const addSupplier = async(req,res,next)=>{
    try {
        const mSupplier = await supplierFieldValidation.validateAsync(req.body);
        const addNewSupplier = Supplier.createSupplier(mSupplier);
        addNewSupplier.save().then((supplier)=>{
            httpResponse({status_code:200, response_message:'Supplier successfully added', data:supplier, res})
        }).catch((err)=>{
            const e = new HttpError(500,err.message);
            return next(e);
        });
    } catch (error) {
        joiError(error,next);
    }
}


module.exports={
    addSupplier
}