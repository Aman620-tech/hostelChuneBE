const https = require('https')
const port = parseInt(process.env.PORT) || 3004;
const { app } = require('./index')
const fs = require("fs");


const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};

https.createServer(options, app)
    .listen(3000, function (req, res) {
        console.log("Server started at port 3000");
    });