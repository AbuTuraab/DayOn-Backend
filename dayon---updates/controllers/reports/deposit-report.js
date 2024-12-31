
const joi = require("joi");
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit } = require("../../model/Deposit/mydeposit");



const VALIADATIONOBJECT = joi.object({
    from: joi.date().required(),
     to: joi.date().required(),
     branch: joi.string().required()
})

const depositReport =async(req,res,next)=>{
    try {
      /*** */
      const VALIDATEDOBJECT = await VALIADATIONOBJECT.validateAsync(req.query)
      const FILTEREDRESULTS =await  Deposit.aggregate([
            { "$match": {
              "$and": [
                { "created_at": { "$gte": VALIDATEDOBJECT.from, "$lte": VALIDATEDOBJECT.to }},
              ]
            }}
          ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            const branchReport = FILTEREDRESULTS.filter(item=>item.branch==req.query.branch);
            httpResponse({status_code:200, response_message:'Deposit record available', data:branchReport, res});
          }else{
              const e = new HttpError(404, "No record found within this range of days");
              return next(e);
          }
    } catch (error) {
       joiError(error,next);
    }
}


module.exports={
    depositReport
}