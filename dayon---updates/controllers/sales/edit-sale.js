const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales");


const editSale = async function editSale(req,res,next){
    try {
        const {id} = req.params;
        const  {
            invoice_number,
            payment_type,
            selling_price,
            selectedProduct,
            quantity,
            product,
            amount,
            serial_number,
        }  = req.body;
        const data = {
            invoice_number,
            payment_type,
            selling_price,
            selectedProduct,
            product,
            quantity,
            amount,
            serial_number,
        }
        if (!id) {
            const e = new HttpError(400, "Please supply id");
            return next(e)
        }
        const updatedSales = await Sales.editSales(id, data);
        if (updatedSales) {
            httpResponse({status_code:200, response_message:"Sales successfully updated", data:updatedSales,res})
        }else{
            const e = new HttpError(400, "Unable to update sales. Contact support if persists");
            return next(e)
        }
       
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}


module.exports={
    editSale
}