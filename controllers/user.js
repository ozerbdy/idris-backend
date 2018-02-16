const UserRepository = require('../db/UserRepository'),
    ResponseHelpers = require('../helpers/responseHelpers'),
    Constants = require('../constants/constants');

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

module.exports.check = async (req, res) => {
    const user = req.user;
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