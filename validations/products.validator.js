const joi = require("joi");

exports.Validation = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
  });

  return schema.validate(data, { abortEarly: false });
};
