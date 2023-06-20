const joi = require("joi");

const userEmailPassSchema = joi.object({
  email: joi.string().email().message("Invalid email").required(),
});

module.exports = userEmailPassSchema;
