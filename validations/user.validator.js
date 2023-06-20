const joi = require("joi");

exports.Validation = (data) => {
  const schema = joi.object({
    name: joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
  });

  return schema.validate(data, { abortEarly: false });
};
