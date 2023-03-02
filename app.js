const express = require("express");
const config = require("config");

const app = express();

const httpServer = require("http").createServer(app);
require("./startup/config")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);

const port = config.get("server.port");

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
