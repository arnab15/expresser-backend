const bcrypt = require("bcryptjs");

exports.hashPasword = (password) => {
	return bcrypt.hash(password, 10);
};
exports.comparePasword = (paswordToCompare, hashedPassword) => {
	return bcrypt.compare(paswordToCompare, hashedPassword);
};
