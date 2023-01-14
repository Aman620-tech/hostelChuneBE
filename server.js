require("dotenv").config({ path: ".env" });
const port = parseInt(process.env.PORT) || 3004;
const https = require('https')
const { app } = require('./index')
const fs = require("fs");


const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};

https.createServer(options, app)
    .listen(port, function (req, res) {
        console.log(`Server started at port ${port}`);
    });
