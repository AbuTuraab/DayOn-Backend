const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Deposit, depositFieldValidation } = require("../../model//Deposit/mydeposit");
const { customerRecord } = require("../../model/customer/customer-txn-list");
const { product } = require("../../model/products/products");



async function findProduct(barcode,id,branch_id){
    const mproduct = await product.findProductByBarcode(barcode,id,branch_id);
    if (mproduct) {
     return mproduct;
    }else{
     const prodcutById = await product.findOne({_id: id, branch:branch_id},)
     return prodcutById;
    }
   }

   async function updateProduct(barcode,id, branch_id,data){
    const mproduct = await product.findOneAndUpdate({_id:id,branch:branch_id},data);
    if (mproduct) {
     return mproduct;
    }else{
     const prodcutById = await product.findOneAndUpdate({product_barcode: barcode, branch:branch_id},data);
     return prodcutById;
    }
   }

const addDeposit = async(req,res,next)=>{
    try {  
       const mDeposit = await depositFieldValidation.validateAsync(req.body); 
       const {branch_id} = req.userData;
       let returnArray = [];
       for (let index = 0; index < mDeposit.items.length; index++) {
        const mproduct =await findProduct(mDeposit.items[index].barcode, mDeposit.items[index].product_id,branch_id);
        if (!mproduct) {
          const e = new HttpError(500, 'No product is found for the barcode or Id provided');
          return next(e);
        }
        if (mDeposit.items[index].quantity <= mproduct.current_product_quantity) {
            const datas = {
                current_product_quantity: mproduct.current_product_quantity -Number(mDeposit.items[index].quantity),
                previous_product_quantity: mproduct.current_product_quantity
            }  
            const updatedProduct =await updateProduct(mDeposit.items[index].barcode,mDeposit.items[index].product_id,branch_id,datas)
            const depositData ={
                created_at:`${mDeposit.items[index].created_at}Z`,
                invoice_number:mDeposit.items[index].invoice_number ,
                amount_deposited: mDeposit.items[index].amount_deposited,
                customer_name: mDeposit.customer_name,
                customer_id: mDeposit.customer_id,
                branch: mDeposit.branch,
                total_amount:  mDeposit.items[index].amount,
                payment_type: mDeposit.payment_type,
                barcode: mDeposit.items[index].barcode,
                product: mDeposit.items[index].product,
                amount_to_balance:Number(mDeposit.items[index].amount) - Number(mDeposit.items[index].amount_deposited) ,
                selectedProduct: mDeposit.items[index].selectedProduct,
                serial_number: mDeposit.items[index].serial_number,
                product_id:mDeposit.items[index].product_id,
                cost_price: mproduct.product_price,
                quantity: mDeposit.items[index].quantity,
                selling_price: mDeposit.items[index].selling_price
              }
              if (mDeposit.customer_id) {
                const existingRecord = await customerRecord.findRecord(mDeposit.customer_id);
                const {total_purchased,total_amount_paid}= existingRecord;
                const data ={
                 total_amount_paid: total_amount_paid +  Number(mDeposit.items[index].amount_deposited) ,
                 total_purchased: total_purchased + Number(mDeposit.items[index].amount),
                 net_balance: total_purchased - total_amount_paid
                }
              await customerRecord.updateRecord(mDeposit.customer_id,data)
            }
            const addDeposit = Deposit.createDeposit(depositData);
            addDeposit.save().then((d)=>{
              returnArray[index] = {product_name: '', product_price: 0}
              if (Object.keys(returnArray).length==mDeposit.items.length) {
                httpResponse({status_code:201, response_message:"Deposit successfully added",data:{},res});
              }
           
            }).catch((err)=>{
                console.log(err);
                const e = new HttpError(500, err.message);
                return next(e);
            })
        }
       }
    } catch (error) {
      joiError(error,next);  
    }
}


module.exports={
    addDeposit
}

