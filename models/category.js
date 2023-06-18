const { Schema, model } = require("mongoose");

const collection = new Schema({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

module.exports = model("categories", collection);
