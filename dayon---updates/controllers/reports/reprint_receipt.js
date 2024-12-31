const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales");




const reprintReceipt = async function reprintReceipt(req,res,next){
    try {
       const {invoiceNumber} = req.query;
       if (!invoiceNumber) {
           return next( new HttpError(400, 'Please provide receipt invoice number'));
       } 

      const sales =await Sales.find({invoice_number:invoiceNumber});
      if (sales&&sales.length>0) {
          httpResponse({status_code:200, response_message:'Sales receipt available', data:sales, res});
      }else{
          return next(new HttpError(404, 'No receipt is associated to provided invoice number. Please check'))
      }
    } catch (error) {
      return next( new HttpError(500, 'Internal server error'));  
    }
}

module.exports={
 reprintReceipt
}