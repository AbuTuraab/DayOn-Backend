const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Branch } = require("../../model/Branch/branch");




const editBranch = async function editBranches(req,res,next){
    try {
      const {id} = req.params;
      const {
        branch_name,
        address,
        manager_name,
        manager_phone,
        manager_address
    } = req.body;
      const data = {
          branch_name,
          address,
          manager_name,
          manager_phone,
          manager_address
      }
      const mBranch =await Branch.updateBranch(id, data);  
      if (mBranch) {
        httpResponse({status_code:200, response_message:'Branch details successfully updated', data:{mBranch}, res});
      }else{
          const e = new HttpError(500, "Unable to update branch. Please contact support if persists");
          return next(e);
      }
    } catch (error) {
        
        const e = new HttpError(500, error.message);
        return next(e);
    }
}

module.exports={
    editBranch
}