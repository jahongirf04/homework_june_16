const { Schema, model } = require("mongoose");

const collection = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  total_amount: {
    type: Number,
    required: true,
  },
});

module.exports = model("orders", collection);
