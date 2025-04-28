// Create a file named 'https-server.js'
const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

// Serve static files from the current directory
app.use(express.static("./"));

const localIp = "";

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const httpsPort = 3443;
https.createServer(options, app).listen(httpsPort, "0.0.0.0", () => {
  console.log(`HTTPS Server running at https://${localIp}:${httpsPort}/`);
});
