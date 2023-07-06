const express = require("express");

const app = express();

const config = require("config");

const PORT = config.get("port") || 3030;

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const mainRouter = require("./routes/index.routes");
const mainViewRouter = require("./routes/view.routes");
const errorHandler = require("./middleware/error_handling_middleware");

const logger = require("./services/logger");
// const expressWinstonLogger = require("./middleware/expressWinstonLogger");
// const expressWinstonErrorLogger = require("./middleware/expressWinstonErrorLogger");

const exHbs = require("express-handlebars");

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));
// console.log(config.get("access_key"));

// // logger.log("LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlar");
// logger.debug("DEBUG ma'lumotlar");
// logger.warn("WARN ma'lumotlar");
// // logger.trace("TRACE ma'lumotlar");
// logger.info("INFO ma'lumotlar");
// // logger.table(["SALIM", "HALIM", "TALIM"]);
// // logger.table([
// //   ["SALIM", "22"],
// //   ["HALIM", "99"],
// //   ["TALIM", "77"],
// // ]);

app.use(express.json());

// app.use(expressWinstonLogger);

// app.use(expressWinstonErrorLogger);

const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);

app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));

app.use("/api", mainRouter);
app.use("/", mainViewRouter);

// Definetly error must checked at the end
app.use(errorHandler);

app.use(cookieParser());

// process.on("uncaughtException", (ex) => {
//   console.log("uncaughtException: ", ex.message);
// });

async function start() {
  try {
    await mongoose.connect(config.get("dbURI"));
    app.listen(PORT, () => {
      console.log(`Server ${PORT} - portda ishga tushdi`);
    });
  } catch (e) {
    console.log("Serverda xatolik", e);
  }
}

start();
