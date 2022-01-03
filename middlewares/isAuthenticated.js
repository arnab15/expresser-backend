const createError = require("http-errors");
const JWT = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
	const accessToken = req.headers["x-auth-token"];
	if (!accessToken) return res.status(400).send({ msg: "No token provided" });
	const bearerToken = accessToken.split(" ");
	const token = bearerToken[1];
	JWT.verify(token, process.env.JWT_TOKEN_SECRET, (err, payload) => {
		if (err) {
			const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
			return res.status(401).send(createError.Unauthorized(message));
		}
		req.user = payload;
		next();
	});
};
