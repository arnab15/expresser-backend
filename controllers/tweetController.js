const createHttpError = require("http-errors");
const { Tweet } = require("../models/Tweet");
const { User } = require("../models/User");

const addNewTweet = async (req, res, next) => {
	try {
		const { tweet } = req.body;
		if (!req.user) return res.status(400).send(createHttpError(400, { message: "User not defined" }));
		const newTweet = new Tweet({
			tweet,
			writtenBy: req.user._id,
		});
		await newTweet.save();
		return res.status(201).send({ message: "Tweet added successfully" });
	} catch (error) {
		next(createHttpError.InternalServerError());
	}
};

const getTweetsOfUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		if (!req.user) return res.status(400).send(createHttpError(400, { message: "User not defined" }));

		const tweets = await Tweet.find({
			writtenBy: userId,
		}).populate("writtenBy", "name _id profilePic username");
		res.send(tweets);
	} catch (error) {
		next(createHttpError.InternalServerError());
	}
};

const getTweets = async (req, res, next) => {
	try {
		if (!req.user) return res.status(400).send(createHttpError(400, { message: "User not defined please login" }));
		const user = await User.findOne({ _id: req.user._id });
		if (!user) return res.status(400).send(createHttpError(404, { message: "User not found" }));
		if (!(user.followers.length > 0)) {
			const tweets = await Tweet.find()
				.populate("writtenBy", "name _id profilePic username")
				.sort({ createdAt: -1 });
			return res.send(tweets);
		}
		const tweetsOfFollowers = await Tweet.find({ writtenBy: { $in: user.followers } })
			.populate("writtenBy", "name _id profilePic username")
			.sort({ createdAt: -1 });
		return res.send(tweetsOfFollowers);
	} catch (error) {
		console.log("err", error);
		next(createHttpError.InternalServerError());
	}
};

module.exports = {
	addNewTweet,
	getTweetsOfUser,
	getTweets,
};
