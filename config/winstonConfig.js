const winston = require("winston");


const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "../informes/logswarn.log", level: "warn" }),
    new winston.transports.File({ filename: "../informes/logserror.log", level: "error" }),
    new winston.transports.Console({ level: "info" }),
  ],
});

module.exports = logger;
