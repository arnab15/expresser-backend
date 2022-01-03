const createHttpError = require("http-errors");
const { generateUsername } = require("../helpers/generateUsername");
const { hashPasword, comparePasword } = require("../helpers/hashPassword");
const { User } = require("../models/User");

const signup = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ email });
		if (userExists) return res.status(400).send(createHttpError(400, { message: "User already exists" }));
		const hashedPassword = await hashPasword(password);
		const username = generateUsername(name);
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			profilePic: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
			username,
		});
		await newUser.save();
		return res.status(201).send({ token: newUser.genarateAuthToken() });
	} catch (error) {
		next(error);
	}
};
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const userExists = await User.findOne({ email });
		if (!userExists) return res.status(404).send(createHttpError.NotFound());
		const isMatched = await comparePasword(password, userExists.password);
		if (!isMatched) return res.send(createHttpError(400, { message: "Invalid password" }));
		res.send({
			token: userExists.genarateAuthToken(),
		});
	} catch (error) {
		next(createHttpError.InternalServerError());
	}
};
module.exports = {
	signup,
	login,
};
