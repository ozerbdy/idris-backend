const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.listen(port, () => console.log(`App listening on port ${port}!`));
