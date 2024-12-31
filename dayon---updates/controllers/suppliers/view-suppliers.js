const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Supplier } = require("../../model/supplier/supplier")



const viewAllSuppliers = async(req,res,next)=>{
 
      try {
          const supplier = await Supplier.findsupplier();
          if (supplier&&supplier.length>0) {
              httpResponse({status_code:200, response_message:'Supplier found', data:{supplier},res});
          }else{
            const err = new HttpError(400, 'You have not added any product supplier.Please add supplier');
            return next(err);
          }
      } catch (error) {
          const e = new HttpError(500, error.message);
          return next(e);
      }

}

module.exports={
    viewAllSuppliers
}