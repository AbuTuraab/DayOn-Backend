

const { Customer } = require('../../model/customer/customer');
const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");


const updateCustomers = async function updateCustomer(req, res, next) {
    try {
        const { customerId } = req.params;
        const { first_name,
            last_name,
            phone_number,
            email,
            address } = req.body;
        const data = {
            first_name,
            last_name,
            phone_number,
            email,
            address
        }
        const updatedCustomer = await Customer.updateCustomer(data, customerId);
        if (updatedCustomer) {
            httpResponse({ status_code: 200, response_message: 'Customers successfully updated', data: { updatedCustomer }, res });
        } else {
            const e = new HttpError(400, 'Something unexpected occur');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(400, 'Something unexpected occur');
        return next(e);
    }
}


module.exports = {
    updateCustomers
}