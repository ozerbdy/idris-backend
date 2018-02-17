const Joi = require('joi');
const Constants = require('../constants/constants');
const ResponseHelpers = require('../helpers/responseHelpers');

module.exports.validate = function(req, res, next) {
    if(res.locals.schema){
        const result = Joi.validate(req.body, res.locals.schema, {
            allowUnknown: true,
            // return all errors a payload contains, not just the first one Joi finds
            abortEarly: false
        });
        if(result.error){
            const responseObject = {
                status: ResponseHelpers.getBasicResponseObject(Constants.ErrorInfo.RequestBodyValidationFailed, result.error.toString())
            };
            return res.status(400).send(responseObject);
        }else{
            return next();
        }
    }
    return next();
};