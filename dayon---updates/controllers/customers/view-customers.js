const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Customer } = require("../../model/customer/customer");


const viewAllCustomers = async function viewAllCustomers(req, res, next) {

    try {
        const { branch_id } = req.userData;
        const customers = await Customer.viewAllCustomer(branch_id);
        if (customers.length > 0) {
            httpResponse({ status_code: 200, response_message: 'Customers available', data: { customers }, res });
        } else {
            const e = new HttpError(404, 'You have not registered any customer');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Internal server error');
        return next(e);
    }
}


const viewSingleCustomer = async function viewSingleCustomer(req,res,next){
        try {
         const {customerId} = req.params;
         const customer = await Customer.viewSingleCustomer(customerId);
         if (customer) {
             httpResponse({ status_code: 200, response_message: 'Customers available', data: { customer }, res });
         } else {
             const e = new HttpError(404, 'You have not registered this customer');
             return next(e);
         }
        } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Internal server error');
        return next(e);
        }
}


module.exports={
    viewAllCustomers,
    viewSingleCustomer
}