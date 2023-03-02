const Joi = require("joi");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(4).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(255),
  });

  return schema.validate(user);
}
module.exports.validateUser = validateUser;
