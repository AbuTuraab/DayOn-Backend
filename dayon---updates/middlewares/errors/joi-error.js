const { HttpError } = require("./http-error");




module.exports= joiError=(error,next)=>{
    if (error.isJoi==true) {
        const errors = new HttpError(400, error.message);
        return next(errors);  
    }
    const errors = new HttpError(500, error.message);
        return next(errors);
}