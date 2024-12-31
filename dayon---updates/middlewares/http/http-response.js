

const httpResponse =({status_code, response_message,data,res})=>{
    res.status(status_code).json({
        status_code,
        response_message,
        data,
    });

}

module.exports={
    httpResponse
}