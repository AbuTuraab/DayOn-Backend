

const joi = require("joi");
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");

const {Sales} = require("../../model/sales/sales");

const VALIADATIONOBJECT = joi.object({
    from: joi.date().required(),
     to: joi.date().required(),
     branch: joi.string().required(),
     payment_type: joi.any()
})

const viewSalesReport =async(req,res,next)=>{
    try {
     const serializedBranch = req.query.branch.toString();
      const VALIDATEDOBJECT = await VALIADATIONOBJECT.validateAsync(req.query)
      const FILTEREDRESULTS =await  Sales.aggregate([
            { "$match": {
              "$and": [
                {"branch": req.query.branch},
                { "created_at": { "$gte": VALIDATEDOBJECT.from, "$lte": VALIDATEDOBJECT.to }},
              ]
            }}
          ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            if (req.query.payment_type==''||!req.query.payment_type) {
              console.log(FILTEREDRESULTS);
              httpResponse({status_code:200, response_message:'Sales record available', data:FILTEREDRESULTS, res});
            }else {
              const serializedPaymentType = req.query.payment_type;
              const branchReport = FILTEREDRESULTS.filter(item=>item.payment_type==serializedPaymentType);
              if (branchReport.length>0) {
                httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
              }else{
                const e = new HttpError(404, "No sales is available for the choosing payment type");
                return next(e)
              }
  
              
            }
           
          }else{
              const e = new HttpError(404, "No record found within this range of date");
              return next(e);
          }
    } catch (error) {
       joiError(error,next);
    }
}


module.exports={
    viewSalesReport
}