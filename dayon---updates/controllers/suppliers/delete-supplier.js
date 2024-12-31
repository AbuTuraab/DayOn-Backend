const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Supplier } = require("../../model/supplier/supplier")



const deleteSupplier = async(req,res,next)=>{
    try {
        const {supplierId} = req.params
        const deletedSupplier =await Supplier.deleteSupplier(supplierId);
        if (deletedSupplier) {
         httpResponse({status_code:200, response_message:'Supplier successfully deleted',data:deletedSupplier,res});
        }
    } catch (error) {
        
        const e = new HttpError(500, error.message);
        return next(e);
    }
}


module.exports={
    deleteSupplier
}