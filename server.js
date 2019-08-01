// input: host address, port number
// host address: 192.168.0.1, port 8080

// 1. call db file to connect to the db server & check connections & authorization.
// 2. start listening to the network port.

const database = require("./db");
const services = require("./web-services");
database.connect();
services.listen("0.0.0.0", process.env.PORT || "3000");
