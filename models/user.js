const { Schema, model } = require("mongoose");

const collection = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_token: {
    type: String,
  },
});

module.exports = model("users", collection);
