const express = require('express'),
    Router = express.Router();


const UserController = require('./controllers/user');

Router.get('/', (req, res) => {
    return res.send('Hello! welcome to randHack webservice');
});

const Authenticator = require('./middlewares/authenticator');

Router.post('/user/login', UserController.login);

Router.post('/user/check', Authenticator.authenticate, UserController.check);

module.exports = Router;