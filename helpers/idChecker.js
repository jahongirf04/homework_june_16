const { default: mongoose } = require("mongoose");

const idChecking = (id) => {
  if (mongoose.isValidObjectId(id)) {
    return false;
  }
  return true;
};

module.exports = { idChecking };
