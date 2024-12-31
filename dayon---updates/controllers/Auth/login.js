const joi = require('joi');
const { signToken } = require('../../middlewares/Authorization/jwt');
const { comparePassword } = require('../../middlewares/Authorization/password');
const { staffRoles } = require('../../middlewares/Authorization/role');
const { HttpError } = require('../../middlewares/errors/http-error');
const joiError = require('../../middlewares/errors/joi-error');
const { httpResponse } = require('../../middlewares/http/http-response');
const { User } = require('../../model/user/user');

const authValidation = async(req,res,next)=>{
    try {
        const {staff_username,branch_id} = req.body;
            // if(branch_id!='Onireke-branch'){
            //     const e = new HttpError(401, "Permission denied. Please contact administrator");
            //     return next(e);   
            // }
        if (!staff_username) {
            const e = new HttpError(401, "Please provide a valid username");
            return next(e); 
        }
     const staff = await User.findUserByUserName(staff_username);
     if (staff) {
        if (staff.role== staffRoles.admin || staff.role ==staffRoles.auditor) {
            next();
        }else{
         if (staff.branch==branch_id) {
            next();
         }else{
            const e = new HttpError(401, "You don't work have access to login to this branch. Please choose appropriate branch");
            return next(e);
         }
        }
     }else{
        const e = new HttpError(401, "No staff is associated with the provided username. Please check");
        return next(e);  
     }
    } catch (error) {
     joiError(error,next);  
    }
}

const loginStaff =async(req,res,next)=>{
    try {
     const loginDetails  = joi.object({
         staff_username: joi.string().required().lowercase(),
         password:  joi.string().required(),
         branch_id: joi.string().required()
     });
     const staffDetails =await loginDetails.validateAsync(req.body);
     const staff = await User.findUserByUserName(staffDetails.staff_username);
     if (staff) {
        const checkPassword = await comparePassword({password:staffDetails.password,username:staff.username});
        if (!!checkPassword) {
            const payload ={
                email: staff.email,
                username: staff.username,
                id: staff._id,
                role: staff.role,
                branch_id:staffDetails.branch_id,
            }
            if (staff.account_status=='suspended') {
                const err = new HttpError(401, 'You have been suspended from work. Your access has been denied');
                return next(err); 
            }else{
                const token  =  signToken({payload});
                httpResponse({status_code:200, response_message:'success',data:{token, username: staff.username},res});
                return;
            }
           
        }
      
        const err = new HttpError(401, 'You have provided an invalid credentials. Please check and try again');
        return next(err);
     }
    } catch (error) {
      joiError(error,next);  
    }
}


module.exports={
    loginStaff,
    authValidation
}