const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
	{
		tweet: {
			type: String,
			trim: true,
			length: 160,
		},
		writtenBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

exports.Tweet = mongoose.model("Tweet", tweetSchema);
