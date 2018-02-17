const Constants = require('../constants/constants');

module.exports.getBasicResponseObject = function(ResponseType, extraMessage){

    const ResponseCode = ResponseType.code;
    const ResponseSuccess = ResponseCode === Constants.SuccessInfo.code;
    let response = {
        code: ResponseCode,
        success: ResponseSuccess,
        message: ResponseType.message
    };
    if (extraMessage) response.message += '; ' + extraMessage;
    return response;
};

module.exports.sendBasicResponse = (res, ResponseType, extraMessage) => {
    return res.send({
        status: this.getBasicResponseObject(ResponseType, extraMessage)
    });
};