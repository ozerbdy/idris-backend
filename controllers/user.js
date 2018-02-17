const Joi = require('joi');
const UserRepository = require('../db/UserRepository');
const ResponseHelpers = require('../helpers/responseHelpers');
const Constants = require('../constants/constants');

module.exports.validateLogin = function(req, res, next){
    res.locals.schema = {
        username: Joi.string().required(),
        password: Joi.string().required()
    };
    next();
};
module.exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserRepository.getToken(username, password);
    const userId = user._id.toString();

    return res.send({
        status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
        user:{
            username: username,
            token: userId
        }
    });
};
module.exports.validateCheck = function(req, res, next){
    res.locals.schema = {
        coordinates: Joi.object().keys({
            latitude: Joi.number().min(0).max(90).required(),
            longitude: Joi.number().min(-180).max(180).required()
        }),
        capacity: Joi.object().keys({
            weight: Joi.number().positive().required(),
            pieces: Joi.number().integer().positive().required()
        })
    };
    next();
};
module.exports.check = async (req, res) => {
    const user = res.locals.user;
    const userId = user._id.toString();
    const coordinates = req.body.coordinates;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    const capacity = req.body.capacity;
    const weightCapacity = capacity.weight;
    const piecesCapacity = capacity.pieces;

    await UserRepository.updateInfo(userId, latitude, longitude, weightCapacity, piecesCapacity);

    return res.send({
        status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo)
    });

};