const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "warn.log", level: "warn" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console({ level: "info" }),
  ],
});

module.exports = logger;
