const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Supplier } = require("../../model/supplier/supplier");




const updateSupplier = async (req, res, next) => {
    try {
        const { supplier_name,
            supplier_address,
            supplier_phone,
            supplier_email,
            contact_person } = req.body;
        const data = {
            supplier_address,
            supplier_email,
            supplier_name,
            supplier_phone,
            contact_person
        }
        const { supplierId } = req.params;
        const updatedSupplier = await Supplier.updateSupplier(supplierId, data);
        if (updatedSupplier) {
            httpResponse({ status_code: 200, response_message: 'Supplier updated', data: updatedSupplier, res });
        }else{
            const e = new HttpError(500, 'Product not successfully updated');
            return next(e);  
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}


module.exports={
    updateSupplier
}