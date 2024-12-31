const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { ExpenseCategory } = require("../../model/Expenses/category");





const addExpensesCategory = async(req,res,next)=>{
    try {
        const {expenses_category} = req.body;
        if (!expenses_category) {
            const e = new HttpError(400, 'expenses_category is required');
            return next(e) 
        }
        const newCategory = ExpenseCategory.addCategory(req.body);
        newCategory.save().then((s)=>{
        httpResponse({status_code:201, response_message:'Expenses category added', data:s,res});
        }).catch((err)=>{
            const e = new HttpError(500, err.message);
            return next(e)
        });
    } catch (error) {
        
        joiError(error,next);
    }
}



const viewCategory = async(req,res,next)=>{
    try {
        const categories = await ExpenseCategory.find({});
        httpResponse({status_code:200, response_message:'Expenses category',data:categories,res});
    } catch (error) {
        joiError(error,next);
    }
}

module.exports={
    addExpensesCategory,
    viewCategory
}