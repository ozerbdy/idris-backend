const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;
const mongoDbName = process.env.MONGO_DB_NAME;

if(!mongoURL || !mongoDbName) throw new Error('Mongodb credentials are not provided as environment variables!');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.listen(port, () => console.log(`App listening on port ${port}!`));
