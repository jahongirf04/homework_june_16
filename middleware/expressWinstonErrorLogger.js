const expressWinston = require("express-winston");
const winston = require("winston");
require("winston-mongodb");

const expressWinstonErrorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});

module.exports = expressWinstonErrorLogger;
