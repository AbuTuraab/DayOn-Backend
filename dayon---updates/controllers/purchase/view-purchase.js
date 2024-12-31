const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Purchase } = require("../../model/Purchases/purchase")




const viewPurchase = async(req,res,next)=>{
    try {
       const {branch_id} = req.userData;
       const mPurchase = await Purchase.findPurchase(branch_id);
       if (mPurchase) {
        httpResponse({status_code:200, response_message:'Available', data:mPurchase, res});
       }else{
           const e = new HttpError(400,"You have not made any purchase");
           return next(e);
       }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    viewPurchase
}