const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { customerTxnHistory } = require("../../model/customer/txn-history");
const { Deposit } = require("../../model/Deposit/mydeposit");
const { Sales } = require("../../model/sales/sales");
const joi = require('joi'); 
const { Customer } = require("../../model/customer/customer");
const { customerRecord } = require("../../model/customer/customer-txn-list");





const viewTransactionHistory = async function viewCustomerTransactionHistory(req,res,next){

    try {
        const {customerId} = req.params
        if (!customerId) {
            const e = new HttpError(400, 'Please provide customerId');
            return next(e);
        }
        const history =await  customerTxnHistory.viewCustomerHistory(customerId);
        httpResponse({status_code:200, response_message:'Transaction history available',data:{history:history.reverse()}, res});
    } catch (error) {
        const e = new HttpError(500, 'Internal system error. Contact support');
        return next(e);
    }
}


const viewCustomerDeposit = async function viewCustomerDeposit(req,res,next){
    try {
     const {customerId} = req.params;
     const {branch_id} = req.userData;
     const customerDeposit = await Deposit.findIndividualCustomerDeposit(customerId, branch_id);
     if (customerDeposit.length>0) {
        httpResponse({status_code:200, response_message:'Deposits available',data:{customerDeposit},res});
     }else{
         const e = new HttpError(404, 'This customer has not made any deposits. Or all deposits has been clear check sales');
         return next(e);
     }
    } catch (error) {
        joiError(error,next);
    }

}

const viewCustomerPurchased = async function viewCustomerSales(req,res,next){
    try {
        const {customerId} = req.params;
        const {branch_id} = req.userData
        const customerPurchased = await Sales.findIndividualCustomerSales(customerId,branch_id);
        if (customerPurchased.length>0){
          httpResponse({status_code:200, response_message:'Sales available', data:{customerPurchased},res});
        }else{
           const e = new HttpError(404, 'Customers has not made any purchase here');
           return next(e); 
        }
    } catch (error) {
        joiError(error,next);
    }
}


const updateCustomerPayment = async function updateCustomerPayment(req,res,next){
    const body = joi.object({
        amount_paid: joi.number().required(),
        customer_id: joi.string().required(),
        invoice_number: joi.string().required(),
        created_at : joi.date().required(),
    })
    try {
       const {amount_paid, customer_id, invoice_number, created_at} = await  body.validateAsync(req.body);
    
       const customer =  await Customer.viewSingleCustomer(customer_id) 
       const data ={
           payment_due:  Number(customer.customer_current_debt) -  Number(amount_paid),
           customer_current_debt: Number(customer.customer_current_debt) -  Number(amount_paid)
          }
          const updateRec = await Customer.updateCustomer(data,customer_id);
       const totalDebt = Number(updateRec.customer_current_debt);
       const history = {
           customer_current_debt: totalDebt -  Number(amount_paid),
           invoice_number:invoice_number,
           amount: customer.customer_current_debt,
           total_amount_paid: Number(amount_paid),
           payment_due:totalDebt -  Number(amount_paid),
           created_at: `${created_at}Z`,
           customer: customer_id ,
           customer_fullname: `${customer.first_name} ${customer.last_name}`
         }
      const  newHis = await customerTxnHistory.createTxnHistory(history);
      if (newHis) {
        httpResponse({status_code:200, response_message:'Payment successfuly updated', data:{newHis},res});
      }
    } catch (error) {
        joiError(error, next)
    }
}

module.exports={
    viewTransactionHistory,
    viewCustomerPurchased,
    viewCustomerDeposit,
    updateCustomerPayment
    
}