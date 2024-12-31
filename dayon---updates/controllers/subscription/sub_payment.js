const axios = require('axios');
const { HttpError } = require('../../middlewares/errors/http-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { cardModel } = require('../../model/card-payment/card_details');
const { cardTransactionModel } = require('../../model/card-payment/txn_history');
const { sendEmail } = require('../Email-management/sendgrid');

const headers = {'Authorization':`Bearer ${process.env.PAYMENT_API_KEY}`, 'content-Type':'application/json'};
const initialCharge = async function initialCharge(req,res,next){
   try {
    const requestBody = {
        customer_email: process.env.COMPANY_EMAIL
    };

     const response = await axios.post('https://drab-ruby-magpie-hose.cyclic.app/api/v1/initialize',requestBody, {headers});
     if (response&&response.data!=null&&typeof response.data.data!="undefined") {
        const paymentUrl = response.data.data.authorization_url;
      
        httpResponse({status_code:201, response_message:'Payment initialized', data:{authorization_url:paymentUrl}, res});
     }else{
     return next(new HttpError(500, 'An error occured. Unable to process charge'));
     }
   } catch (error) {
      console.log(error);
     return next(new HttpError(500, 'Internal server error. Contact support'));
   }
}



const processPayment = async function processPayment(req,res,next){
    try {
        const {paymentResponse, status, isfirstPayment, reference} = req.body;
            if (paymentResponse=='charge.success') {
           if (status=='success'&&isfirstPayment=="true") {    
            const txn =   cardTransactionModel.addTransaction({amount_paid:5000, status:'success',reference});
            txn.save();
           }else if(status=='success'&&isfirstPayment=="false"){
            const txn =   cardTransactionModel.addTransaction({amount_paid:5000, status:'success',reference});
            txn.save();
           }else if(isfirstPayment!="true"&&status!='success'){
          const txn =   cardTransactionModel.addTransaction({amount_paid:5000, status:'failed',reference});
          txn.save();
           }
        
            }  
    } catch (error) {
     console.log(error);
    }
    res.sendStatus(200);
}

const monthlyCharges = async function monthlyCharges(){
    try {
        const cardInSystem = await cardModel.getCards();
        
        const requestBody = {
            authorization_code: cardInSystem[0].authorization_code,
            email:'bolexguy@gmail.com', 
            amount:5000*100, 
            metadata:{
             isfirstPayment: false
        }
    };
      await axios.post('https://api.paystack.co/transaction/charge_authorization',requestBody, {headers});
       } catch (error) {
          console.log(error);
       }
}




module.exports= {
    initialCharge,
    processPayment,
    monthlyCharges
}