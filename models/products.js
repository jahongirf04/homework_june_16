const { Schema, model } = require("mongoose");

const collection = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
  token: {
    type: String,
  },
});

module.exports = model("products", collection);
