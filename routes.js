const express = require('express'),
    Router = express.Router();


const UserController = require('./controllers/user'),
    PackageController = require('./controllers/package'),
 TransportationController = require('./controllers/transportation');

Router.get('/', (req, res) => {
    return res.send('Hello! welcome to randHack webservice');
});

const Authenticator = require('./middlewares/authenticator');

Router.post('/user/login', UserController.login);

Router.post('/user/check', Authenticator.authenticate, UserController.check);

Router.get('/package/list', PackageController.list);

Router.post('/transportation/apply', Authenticator.authenticate, TransportationController.apply);

module.exports = Router;