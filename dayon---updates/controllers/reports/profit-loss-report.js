const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales");
const joi = require('joi');

const VALIADATIONOBJECT = joi.object({
    from: joi.date().required(),
    to: joi.date().required(),
    branch: joi.string().required()
})




/*****NOTE: Profit and loss are determined by the substraction of selling_price per unit of items from the
 * stock_price. 
 */
const viewProfitLossReport = async (req, res, next) => {
    try {
        const VALIDATEDOBJECT = await VALIADATIONOBJECT.validateAsync(req.query)
        const FILTEREDRESULTS = await Sales.aggregate([
            {
                "$match": {
                    "$and": [
                        { "created_at": { "$gte": VALIDATEDOBJECT.from, "$lte": VALIDATEDOBJECT.to } },
                      
                    ]
                }
            }
        ]);
        if (FILTEREDRESULTS && FILTEREDRESULTS.length > 0) {
            const items = []
          FILTEREDRESULTS.map((result)=>{
              items.push(...result.items);
          });
          const branchReport = items.filter(item=>item.branch==VALIADATIONOBJECT.branch);
            httpResponse({ status_code: 200, response_message: 'Sales record available', data: branchReport, res });
        } else {
            const e = new HttpError(404, "No record found within this range of days");
            return next(e);
        }
    } catch (error) {
        joiError(error, next);
    }
}


module.exports={
    viewProfitLossReport
}