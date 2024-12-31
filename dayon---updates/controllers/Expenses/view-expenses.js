const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Expenses } = require("../../model/Expenses/expenses")




const viewExpenses = async(req,res,next)=>{
    try {
        const expenses =await Expenses.viewExpenses();
        const {branch_id} = req.userData
        if (expenses&&expenses.length>0) {
          const branchExpenses = expenses.filter(e=>e.branch_name==branch_id);
          httpResponse({status_code:200, response_message:'List Of Expenses', data:branchExpenses, res});
          return;   
        }else{
            const e = new HttpError(404, 'You have not incurred any expenses');
            return next(e);
        }
    } catch (error) {
      const e = new HttpError(500, error.messgae);
      return next(e);       
    }
}


module.exports={
 viewExpenses   
}