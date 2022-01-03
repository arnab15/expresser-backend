const createHttpError = require("http-errors");
const Joi = require("joi");
const Validators = require("../validators/index");

module.exports = function (validator) {
	if (!Validators.hasOwnProperty(validator)) throw new Error(`'${validator}' validator is not exist`);

	return async function (req, res, next) {
		try {
			const validated = await Validators[validator].validateAsync(req.body || {});
			req.body = validated;
			next();
		} catch (err) {
			if (err.isJoi) return next(createHttpError(422, { message: err.message }));
			next(createHttpError(500));
		}
	};
};
