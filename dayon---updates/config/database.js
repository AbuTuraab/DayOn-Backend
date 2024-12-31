
const mongoose = require("mongoose");
const { secretKeys } = require("./keys");
const databaseAuthentication =async()=>{
    try {
        mongoose.connect(secretKeys.DATABASE_URL).then(()=>{
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        
    }
}


module.exports={
    databaseAuthentication,
  
}