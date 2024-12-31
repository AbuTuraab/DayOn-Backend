const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { exepensesValidation, Expenses } = require("../../model/Expenses/expenses")




const addExpenses = async(req,res,next)=>{
    try {
        const expensesBody =await exepensesValidation.validateAsync(req.body);
        const newExpenses = Expenses.addExpenses(expensesBody);
        newExpenses.save().then((s)=>{
            httpResponse({status_code:201, response_message:'Expenses successfully added', data:s, res});
            return;
        }).catch((err)=>{
            const e = new HttpError(500, err.message);
            return next(e);
        })

    } catch (error) {
        joiError(error,next)
    }
}


module.exports={
    addExpenses
}