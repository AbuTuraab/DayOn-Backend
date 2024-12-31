const { User } = require("../../model/user/user");
const { HttpError } = require("../errors/http-error");


const staffRoles = {
    operator:'operator',
    manager: 'manager',
    auditor: 'auditor',
    admin:  'super admin'

}





const isAdmin = async(req,res,next)=>{
    try {
      const {role} = req.userData;
      if (role==staffRoles.admin) {
          next();
      }else{
          const access_denied = new HttpError(403, 'Only Admin can perform this operation.Your access has been denied');
          return next(access_denied);
      }
    } catch (error) {
        const e = new HttpError(500, error.message);
    }
}

const isAdminOrEditor = async(req,res,next)=>{
    try {
      const {role} = req.userData;
      if (role==staffRoles.admin || role==staffRoles.auditor) {
          next();
      }else{
          const access_denied = new HttpError(403, 'Only Admin can perform this operation.Your access has been denied');
          return next(access_denied);
      }
    } catch (error) {
        const e = new HttpError(500, error.message);
    }
}

const isManager = async(req,res,next)=>{
    try {
      const {role} = req.userData;
      if (role==staffRoles.manager ||staffRoles.admin) {
          next();
      }else{
          const access_denied = new HttpError(403, 'This operation can only be done by company manager and Admin. Your access has been denied');
          return next(access_denied);
      }
    } catch (error) {
        const e = new HttpError(500, error.message);
    }
}
const isOperator = async(req,res,next)=>{
    try {
      const {role} = req.userData;
      if (role==staffRoles.manager ||staffRoles.admin||staffRoles.operator) {
          next();
      }else{
          const access_denied = new HttpError(403, 'You must be company operator to do this.Your access has been denied');
          return next(access_denied);
      }
    } catch (error) {
        const e = new HttpError(500, error.message);
    }
}

const isAuditor = async(req,res,next)=>{
    try {
      const {role} = req.userData;
      if (role==staffRoles.manager ||staffRoles.admin||staffRoles.auditor) {
          next();
      }else{
          const access_denied = new HttpError(403, 'You must be company auditor to do this.Your access has been denied');
          return next(access_denied);
      }
    } catch (error) {
        const e = new HttpError(500, error.message);
    }
}



module.exports={
    staffRoles,
    isManager,
    isOperator,
    isAuditor,
    isAdmin,
 isAdminOrEditor


}