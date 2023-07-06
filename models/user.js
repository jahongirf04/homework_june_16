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
  user_activation_link: {
    type: String,
  },
  user_is_active: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("users", collection);
