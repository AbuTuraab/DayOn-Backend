

const jwt = require("jsonwebtoken");
const { secretKeys } = require("../../config/keys");
const { httpResponse } = require("../http/http-response");


const signToken=({payload})=>{
   try {
       const token = jwt.sign(payload,secretKeys.JWT_SECRET)
       return token
   } catch (error) {
    throw new Error(error);  
   }
}



const verifyToken=(req,res,next)=>{
   try {
    const token = req.header("Authorization").split(' ')[1];
    if(!token){
        httpResponse({status_code:401, response_message:"Access denied. No token provided",body:{}, res});
        return;
    }
  const decoded =   jwt.verify(token, secretKeys.JWT_SECRET);
  req.userData = decoded;
    next();
   } catch (error) {
       httpResponse({status_code:401,response_message:"Unathorized, invalid token provided", body:{}, res});
   }
}


module.exports={
    signToken,
    verifyToken
}