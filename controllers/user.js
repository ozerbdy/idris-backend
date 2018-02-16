const UserRepository = require('../db/UserRepository'),
    ResponseHelpers = require('../helpers/responseHelpers'),
    Constants = require('../constants/constants');

module.exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserRepository.get(username, password);
    const userId = user._id.toString();

    return res.send({
        status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
        user:{
            token: userId
        }
    });
};