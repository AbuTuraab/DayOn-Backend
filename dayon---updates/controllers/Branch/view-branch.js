const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Branch } = require("../../model/Branch/branch");
const { cardTransactionModel } = require("../../model/card-payment/txn_history");


const listAllStores = async(req,res,next)=>{
    try {
        const [stores,failedTxn] = await Promise.all([Branch.findBranches(), cardTransactionModel.getFailedTransactions()]);
        httpResponse({status_code:200, response_message:'avaiilable', data:failedTxn.length>0?[]: stores,res});
    } catch (error) {
        const err = new HttpError(500,error.message);
        return next(err);
    }
}

module.exports={
    listAllStores
}