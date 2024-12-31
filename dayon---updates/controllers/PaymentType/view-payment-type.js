const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit, paymentType } = require("../../model/PaymentType/payment-type")





const viewPaymentType =async(req,res,next)=>{
    try {
     
        const d =await paymentType.listpaymentType();
        httpResponse({status_code:200, response_message:'Payment type list',data:d,res});
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e); 
    }
}


const deletePaymentType = async function(req,res,next){
    try {
        const {paymentId} = req.params;
        const deletePayment =  await paymentType.findOneAndDelete({_id:paymentId});
        if (deletePayment) {
           httpResponse({status_code:200, response_message:'Payment type successfully deleted',data:{},res});  
        }else{
            return next(new HttpError(400, 'Unable to delete payment type'));
        }
    } catch (error) {
        return next(new HttpError(500, 'An error occured with the system. Contact support'));
    }
}

module.exports ={
    viewPaymentType,
    deletePaymentType
}