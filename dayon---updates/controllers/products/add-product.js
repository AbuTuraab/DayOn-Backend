const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product, productFieldValidation, productPreSaveHook } = require("../../model/products/products")



const addProducts = async (req, res, next) => {
    try {
        const { branch_id } = req.userData;
        const { product_name,
            product_price,
            selling_price,
            current_product_quantity,
            product_barcode,
            product_brand,
            supplier } = req.body
        const mProduct = {
            product_name,
            product_barcode,
            product_price,
            current_product_quantity,
            selling_price,
            supplier,
            product_brand
        }
        if (mProduct.product_barcode!=null&&mProduct.product_barcode!='') {
            const productExists = await product.findProductByBarcode(mProduct.product_barcode, branch_id);
            if (productExists) {
                const err = new HttpError(400, 'A product already exists with the barcode');
                return next(err);
            } 
        }
        const addNewProducts = product.createProduct(mProduct);
        const data = {
            branch_id,
        }

        addNewProducts.save().then(async (addedProduct) => {
            // console.log(branch_id);
            const p = await product.findOneAndUpdate({ _id: addedProduct._id }, { branch: branch_id }, { upsert: true });
            httpResponse({ status_code: 200, response_message: 'Product added', data: p, res });

        }).catch((err) => {
            const error = new HttpError(400, err.message);
            return next(error);
        });

    } catch (error) {
        console.log(error);
        joiError(error, next);
    }
}

module.exports = {
    addProducts
}