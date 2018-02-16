const UserRepository = require('../db/UserRepository'),
    Constants = require('../constants/constants');


module.exports.authenticate = async (req, res, next) => {
    const token = req.get(Constants.TOKEN_REQUEST_HEADER_NAME);
    const user = await UserRepository.get(token);
    req.user = user;
    next();
};