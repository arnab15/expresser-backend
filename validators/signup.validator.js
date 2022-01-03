const Joi = require("joi");
const signupSchema = Joi.object({
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().min(4).required(),
	name: Joi.string().min(1).required(),
});
module.exports = signupSchema;
