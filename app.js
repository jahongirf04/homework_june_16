const express = require("express");

const app = express();

const config = require("config");

const PORT = config.get("port") || 3030;

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const mainRouter = require("./routes/index.routes");
const errorHandler = require("./middleware/error_handling_middleware");

app.use(express.json());

app.use("/api", mainRouter);

// Definetly error must checked at the end
app.use(errorHandler);

app.use(cookieParser());

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
