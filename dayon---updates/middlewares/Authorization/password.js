
const bcrypt = require("bcryptjs");
const {HttpError} = require("../http/http-response");
const crypto = require("crypto");
const mongoose = require("mongoose");




const secret = crypto.randomBytes(12);
const salt = bcrypt.genSaltSync(12, secret);

async function hashedPassword({password}){
    if(!password){
        const err = new HttpError(400, "Please supply a data to be hashed")
        throw err
    }
    try {
        const hash =await  bcrypt.hash(password,salt);
        return hash;
    } catch (error) {
        const err = new Error(500, error.message);
        throw err
    }
}

async function comparePassword({password, username}){
    if(!password){
        const err = new Error("Please supply a data to be hashed")
        throw err
    }
    try {
        const User = mongoose.model("User");
        const user =await User.findUserByUserName(username);
        const passwordMatch =await  bcrypt.compare(password,user.password);
        return passwordMatch;  /****A boolean*/
    } catch (error) {
        console.log(error);
        const err = new Error(500, error.message);
        throw err
    }
}

module.exports={
    hashedPassword,
    comparePassword
}