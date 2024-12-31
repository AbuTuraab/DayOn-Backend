const { hashedPassword } = require("../../middlewares/Authorization/password");
const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { User } = require("../../model/user/user");





const staffProfile = async (req, res, next) => {
    try {
        const { username } = req.userData;
        const staff = await User.findUserByUserName(username);
        if (staff) {
            httpResponse({ status_code: 200, response_message: 'profile found', data: staff, res });
            return;
        }
        const e = new HttpError(404, "No user is asscoiated with the this username");
        return next(e);
    } catch (error) {
        const e = new HttpError(500, error.messgae);
        return next(e);
    }
}


const updateProfile = async function updateProfile(req, res, next) {
    try {
        const { first_name,
            last_name,
            username,
            email,
            password,
            role,
            branch, } = req.body;
            const hashed  =await hashedPassword({password});   
        const data = {
            first_name,
            last_name,
            username,
            email,
            role,
            password:hashed,
            branch,
        }
        const {id} = req.params;
        const updateUser = await User.updateUser(id, data);
        if (updateUser) {
            httpResponse({ status_code: 200, response_message: "Profile Successfully updated", data: {}, res })
        } else {
            const e = new HttpError(400, "Unable to update profile. Contact support if persists");
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.messgae);
        return next(e);
    }
}


const suspendProfile = async function suspendProfile(req,res,next){

    try {
        const {id} = req.params;

        const data = {
            account_status: "suspended"
        }

        const profile = await User.updateUser(id, data);

        if (profile) {
            httpResponse({status_code:200, response_message:"Staff has been suspended", data:{}, res});
        }else{
            const e = new HttpError(400, "We are unable to suspend staff at the moment. Please contact suport if perists");
            return next(e);
        }
    } catch (error) {
        const e = new HttpError(500, error.message);
        return next(e);
    }
}


const deleteProfile = async function deleteProfile(req,res,next){

    try {
        const {id}  = req.params;

        const profile = await User.deleteUser(id);

        if (profile) {
            httpResponse({status_code:200, response_message:"Staff account has been successfully delete", res});
        }else{
            const e = new HttpError(400, "Unable to delete staff at the moment contact support if persists");
            return next(e);
        }
    } catch (error) {
        const e  = new HttpError(500, error.messgae);
        return next(e);
    }
}


module.exports = {
    staffProfile,
    updateProfile,
    deleteProfile,
    suspendProfile
}