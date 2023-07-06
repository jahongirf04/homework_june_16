const expressWinston = require("express-winston");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const { combine, timestamp, prettyPrint, metadata } = winston.format;

const expressWinstonLogger = expressWinston.logger({
  transports: [
    new winston.transports.MongoDB({
      db: config.get("dbURI"),
      options: { useUnifiedTopology: true },
    }),
  ],
  format: combine(timestamp(), prettyPrint(), metadata()),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) {
    return false;
  }, // optional: allows to skip some log messages based on request and/or response
});

module.exports = expressWinstonLogger;
