const Joi = require("joi");
const tweetSchema = Joi.object({
	tweet: Joi.string().required().max(140),
});
module.exports = tweetSchema;
