const UserRepository = require('../db/UserRepository');

module.exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserRepository.get(username, password);
    const userId = user._id.toString();

    return res.send({
        status: {
            code: 0,
            success: true,
            message: 'success'
        },
        user:{
            token: userId
        }
    });
};