const express = require('express'),
    Router = express.Router();

const UserController = require('./controllers/user');

Router.get('/', (req, res) => {
    return res.send('Hello! welcome to randHack webservice');
});

Router.post('/user/login', UserController.login);

module.exports = Router;