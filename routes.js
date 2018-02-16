const express = require('express'),
    Router = express.Router();


Router.get('/', (req, res) => {
    return res.send('Hello! welcome to randHack webservice');
});

module.exports = Router;