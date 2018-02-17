const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongo = require('./db/mongo'),
    socketIO = require('socket.io'),
    socketIOManager = require('./socket/socketIOManager'),
    routes = require('./routes');


const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;
const mongoDbName = process.env.MONGO_DB_NAME;

if(!mongoURL || !mongoDbName) throw new Error('Mongodb credentials are not provided as environment variables!');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(routes);

mongo.init(mongoURL, mongoDbName, async (err) => {
    if(err) throw err;
    console.log('Mongo connection established successfully!');
    const http = require('http');
    const server = http.createServer(app);
    const io = socketIO(server);
    server.listen(port ,() => console.log(`App listening on port ${port}!`))
    socketIOManager.initalizeEventListeners(io);
});
