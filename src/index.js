const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;

// Create Mongo connection and get the express app to listen on config.port

// Start the Node server

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});

mongoose.connect(config.mongoose.url, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log("Connected to MongoDB")
});

// ------------- Don't Modify  -------------
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
