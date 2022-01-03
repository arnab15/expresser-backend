const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		profilePic: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

userSchema.methods.genarateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
			profilePic: this.profilePic,
			username: this.username,
		},
		process.env.JWT_TOKEN_SECRET,
		{ expiresIn: process.env.JWT_TOKEN_EXP }
	);
	return token;
};

exports.User = mongoose.model("User", userSchema);
