const is = require('is_js');
const ResponseHelpers = require('../helpers/responseHelpers');
const UserRepository = require('../db/UserRepository');
const Constants = require('../constants/constants');


module.exports.authenticate = async (req, res, next) => {
    const token = req.get(Constants.TOKEN_REQUEST_HEADER_NAME);
    const user = await UserRepository.get(token);
    if(is.existy(user)){
        res.locals.user = user;
        next();
    }else{
        return res.send({
            status: ResponseHelpers.getBasicResponseObject(Constants.ErrorInfo.AuthenticationFailed)
        });
    }
};