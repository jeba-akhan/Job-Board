const apiResponse = (res, statusCode, data, message )=>{ 
     
    return res.status(statusCode).json({message, data, success:statusCode< 400 ? true : false})
}


module.exports = apiResponse;