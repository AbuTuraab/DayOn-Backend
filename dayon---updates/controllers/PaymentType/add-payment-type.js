const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit, paymentType } = require("../../model/PaymentType/payment-type")

const joi = require('joi');

const paymentVal = joi.object({
    payment_type: joi.string().required().uppercase()
});




const addpaymentType =async(req,res,next)=>{
    try {
     const   paymentBody = await paymentVal.validateAsync(req.body);
        const d =  paymentType.createPaymentType(paymentBody);
        d.save().then((s)=>{
         httpResponse({status_code:201, response_message:'Psyment method successfully added',data:s,res});
        }).catch((err)=>{
            const e = new HttpError(500, err.message);
            return next(e);
        });
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, error.message);
        return next(e); 
    }
}

module.exports ={
    addpaymentType
}