const config = require("config");
const { json } = require("express");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, colorize } = format;

require("winston-mongodb");

// const myFormat = printf(({ level, message, label, timestamp }) => {
//   return `${timestamp} [${label}] ${level}: ${message}`;
// });

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
var logger;
if (process.env.NODE_ENV == "development") {
  logger = createLogger({
    format: combine(colorize(), timestamp(), myFormat),
    transports: [
      new transports.Console({ level: "debug" }),
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "log/error.log", level: "info" }),
      // new transports.Http({ level: "warn", format: json() }),
      // new transports.MongoDB({
      //   db: config.get("dbURI"),
      //   options: { useUnifiedTopology: true },
      // }),
    ],
  });
} else {
  logger = createLogger({
    format: combine(colorize(), timestamp(), myFormat),
    transports: [
      // new transports.Console({ level: "debug" }),
      // new transports.File({ filename: "error.log", level: "error" }),
      // new transports.File({ filename: "log/error.log", level: "info" }),
      // new transports.Http({ level: "warn", format: json() }),
      new transports.MongoDB({
        db: config.get("dbURI"),
        options: { useUnifiedTopology: true },
      }),
    ],
  });
}
logger.exceptions.handle(
  new transports.File({ filename: "log/exeptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "log/rejections.log" })
);
logger.exitOnError = false;

module.exports = logger;
