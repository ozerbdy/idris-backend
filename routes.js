const express = require('express'),
    Router = express.Router();


const UserController = require('./controllers/user'),
    PackageController = require('./controllers/package'),
 TransportationController = require('./controllers/transportation');

Router.get('/', (req, res) => {
    return res.send('Hello! welcome to randHack webservice');
});

const Authenticator = require('./middlewares/authenticator');
const ParameterValidator = require('./middlewares/parameterValidator');

Router.post('/user/login', UserController.validateLogin, ParameterValidator.validate, UserController.login);
Router.post('/user/check', Authenticator.authenticate, UserController.validateLogin, ParameterValidator.validate, UserController.check);

Router.get('/package/list', PackageController.list);
Router.post('/package/pickUp', Authenticator.authenticate, PackageController.validatePickUp, ParameterValidator.validate, PackageController.pickUp);

Router.get('/transportation/get', Authenticator.authenticate, TransportationController.get);
Router.post('/transportation/apply', Authenticator.authenticate, TransportationController.validateApply, ParameterValidator.validate, TransportationController.apply);
Router.post('/transportation/finish', Authenticator.authenticate, TransportationController.finish);

module.exports = Router;