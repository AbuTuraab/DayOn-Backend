
const joi = require('joi');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { Customer } = require('../../model/customer/customer');
const { customerTxnHistory } = require('../../model/customer/txn-history');

const bodyValidation = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    phone_number: joi.string().required(),
    customer_current_debt: joi.number().required(),
    amount_paid: joi.number().required(),
    email: joi.string().required().lowercase(),
    address: joi.string().required()
})


const addNewCustomer = async(req,res,next)=>{
    try {
       const validation = await bodyValidation.validateAsync(req.body);
       const {branch_id} = req.userData
       const others ={
        branch:branch_id
       } 
      const newCustomer= await Customer.createNewCustomer(validation, others);
      const { customer_current_debt, amount_paid} = validation;
      if (newCustomer) {
          const history = {
            customer_current_debt: Number(customer_current_debt)- Number(amount_paid),
            invoice_number: 'opening-balance',
            amount: Number(customer_current_debt),
            total_amount_paid: Number(amount_paid),
            payment_due: Number( customer_current_debt) - Number(amount_paid) ,
            customer: newCustomer.id,
            customer_fullname: `${newCustomer.first_name} ${newCustomer.last_name}`
          }
          customerTxnHistory.createTxnHistory(history),
         httpResponse({status_code:201, response_message:'Customer successfully added', data:{newCustomer},res}); 
      } else {
        const e = new HttpError(500, 'Something unexpected happened. Please contact support');
        return next(e);
      }
    } catch (error) {
        joiError(error, next)
    }
}

module.exports={
addNewCustomer
}