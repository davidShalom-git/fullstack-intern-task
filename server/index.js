const { app, startServer } = require("./Server");

if (require.main === module) startServer();

module.exports = app;
