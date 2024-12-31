const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { branchFieldValidation, Branch } = require("../../model/Branch/branch")



const createStore = async(req,res,next)=>{
    try {
        /**Only manager or admin can create a new store */
       const BranchDetails =await branchFieldValidation.validateAsync(req.body); 
        const newBranch =  Branch.createBranch(BranchDetails);
       newBranch.save().then((store)=>{
        httpResponse({status_code:200, response_message:'Store successfully created', data:store,res });
       }).catch((e)=>{
        const err = new HttpError(500,e.message);
        return next(err);
       })
    } catch (error) {
       joiError(error,next);   
    }
}


module.exports={
    createStore
}