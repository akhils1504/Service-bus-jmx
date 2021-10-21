const express = require('express');
const bodyParser = require('body-parser')
const config = require('./lib/config')
const routestest = require('./routes/api');
const morgan = require('morgan');
//const logger = require('./lib/logger');

const app = express();

const PORT = config.app.port;

//used for request logging
/*
app.use(morgan("common", {
    stream: {
      write: (message) => {
        logger.info(message);
      }
    }
}));
*/

//used for formatted and tabbed JSON output
app.set("json spaces", 4);

//middleware to handle json requests
app.use(bodyParser.json());

//handle root path
app.get('/',(req,res) => res.send('REST API'));

app.use('/test',routestest);

//start server
app.listen(PORT, () => {
        console.log('Server is up Port : %d',PORT);
    }
);

module.exports = app;