const createHttpError = require("http-errors");
const { User } = require("../models/User");

const getUserProfileByUsername = async (req, res, next) => {
	try {
		const { username } = req.params;

		if (!username) return res.status(400).send(createHttpError(400, { message: "Username is required param" }));
		const userExists = await User.findOne({ username }).select("-password");
		if (!userExists) return res.status(400).send(createHttpError(400, { message: "Invalid username" }));
		res.send(userExists);
	} catch (error) {
		next(createHttpError.InternalServerError());
	}
};

const gerUserProfles = async (req, res, next) => {
	try {
		console.log(req.user);
		if (!req.user) return res.status(400).send(createHttpError(400, { message: "User not defined" }));
		const user = await User.findById(req.user._id);
		console.log(user.following);
		const profiles = await User.find({
			$and: [{ _id: { $ne: req.user._id } }, { _id: { $nin: user.following } }],
		})
			.select("-password -email")
			.limit(10)
			.sort({ createdAt: -1 });
		res.send(profiles);
	} catch (error) {
		console.log("error", error);
		next(createHttpError.InternalServerError());
	}
};

const followProfile = async (req, res, next) => {
	try {
		const { profileId } = req.params;
		if (!req.user) return res.status(400).send(createHttpError(400, { message: "User not defined" }));
		const user = await User.findOne({ _id: req.user._id });
		if (!user) return res.status(400).send(createHttpError(404, { message: "User not found" }));
		const isUserAlreadyFollowed = user.following.includes(profileId);
		if (isUserAlreadyFollowed)
			return res.status(400).send(createHttpError(400, { message: "User already followed" }));
		const followedUser = await User.findOne({ _id: profileId });
		if (!followedUser) return res.status(400).send(createHttpError(404, { message: "Following user not found" }));
		const isUserAlreadyFollowing = followedUser.followers.includes(profileId);
		if (isUserAlreadyFollowing)
			return res.status(202).send(createHttpError(202, { message: "User already following that user" }));
		user.following.push(profileId);
		followedUser.followers.push(user._id);
		await user.save();
		await followedUser.save();
		return res.send({ message: "User followed successfully" });
	} catch (error) {
		next(createHttpError.InternalServerError());
	}
};
const unfollowProfile = async (req, res, next) => {
	try {
		const { profileId } = req.params;
		if (!req.user) return res.status(400).send(createHttpError(400, { message: "User not defined" }));
		const user = await User.findOne({ _id: req.user._id });
		if (!user) return res.status(400).send(createHttpError(404, { message: "User not found" }));
		const usersAfterRemovingFromFollowingOfCurrentUser = user.following.filter((uId) => !uId.equals(profileId));
		user.following = usersAfterRemovingFromFollowingOfCurrentUser;
		const followedUser = await User.findOne({ _id: profileId });
		if (!followedUser) return res.status(400).send(createHttpError(404, { message: "Following user not found" }));
		const usersAfterRemovingFromfollowersProfile = followedUser.followers.filter((uId) => !user._id.equals(uId));
		followedUser.followers = usersAfterRemovingFromfollowersProfile;
		await user.save();
		await followedUser.save();
		return res.send({ message: "User unfollowed successfully" });
	} catch (error) {
		next(createHttpError.InternalServerError());
	}
};

module.exports = {
	getUserProfileByUsername,
	gerUserProfles,
	followProfile,
	unfollowProfile,
};
