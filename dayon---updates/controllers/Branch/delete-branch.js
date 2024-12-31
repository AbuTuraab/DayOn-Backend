const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Branch } = require("../../model/Branch/branch");




const deleteBranch = async function deleteBranch(req,res,next){
    try {
      const {id} = req.params;
      const mBranch =await Branch.deleteBranch(id);
        if (mBranch) {
            httpResponse({status_code:200, response_message:'Branch successfully deleted', data:mBranch, res});

        }else{
            const e = new HttpError(500, "Unable to delete branch. Contact support if persists");
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}


module.exports={
    deleteBranch
}