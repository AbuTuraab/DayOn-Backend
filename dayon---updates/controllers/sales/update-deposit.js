const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit } = require("../../model/Deposit/mydeposit");
const { product } = require("../../model/products/products");
const { Sales } = require("../../model/sales/sales");




const updatemountPaid = async (req, res, next) => {
    try {
        const { price,customer_name, created_at } = req.body;
        const { id } = req.params;
        if (!price) {
            const e = new HttpError(400, "Please provide a amount deposited");
            return next(e);
        }
        if (!id) {
            const e = new HttpError(400, "Please provide an id in your params");
            return next(e);
        }
        const previousDeposit = await Deposit.findById(id);
         if (!previousDeposit) {
             const e = new HttpError(400, "No deposit has been created with the provided id");
             return next(e);
         }
         if (price>previousDeposit.amount_to_balance) {
            const e = new HttpError(400, `Amount you entered is greater than amount to deposit. You have ${previousDeposit.amount_to_balance} Naira to balance`);
            return next(e);  
         }
        const data ={
            customer_name,
            created_at,
            amount_deposited:Number( previousDeposit.amount_deposited) + Number(price),
            amount_to_balance: Number(previousDeposit.amount_to_balance) - Number(price),
            
        }
        const updatedDeposit =await Deposit.updateDeposit(id, data);
      
        if (updatedDeposit) {
            const { total_amount,  product_id,amount_deposited,quantity,barcode, selling_price,serial_number,branch,invoice_number, payment_type,created_at, customer_name,cost_price,customer_id } = updatedDeposit;
            if (Number(updatedDeposit.amount_to_balance)==0) {
                /**@description move product to sales... */

                const mproduct =await product.findOne({_id:product_id})
                const addNewSales = new Sales({
                    invoice_number,
                    customer_name,
                    amount: total_amount,
                    serial_number,
                    selling_price,
                    customer_id,
                    barcode,
                    selectedProduct: mproduct._id,
                    product: mproduct.product_name,
                    product_id,
                    quantity,
                    cost_price,
                    branch,
                    payment_type,
                    created_at
                });
                addNewSales.save().then(async(s) => {
                    await Deposit.findOneAndDelete({_id:id});
                    httpResponse({ status_code: 200, response_message: 'You have successfully balance up. Product moved to sales record', res });
                }).catch((err) => {
                    const e = new HttpError(500, err.message);
                    return next(e);
                });
            } else {
                httpResponse({ status_code: 201, response_message: 'Amount deposited has been recieved and record updated', res });
                return;
            }
        }
    } catch (error) {
        joiError(error, next);
    }
}

module.exports={
    updatemountPaid
}