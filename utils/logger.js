const logger = require("../config/winstonConfig");

 function logWinston(req, res, next) {
  logger.info(`Ruta ${req.originalUrl}, method ${req.method}`);
  next();
};
module.exports = logWinston