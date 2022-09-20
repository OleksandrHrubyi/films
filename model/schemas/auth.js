const Joi = require("joi");
const registrSchema = Joi.object({
  password: Joi.string().required()
})



module.exports = registrSchema;
