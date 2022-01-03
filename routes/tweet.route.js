const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const Validator = require("../middlewares/Validator");
router.post("/tweet", isAuthenticated, Validator("tweet"), tweetController.addNewTweet);
router.get("/tweets", isAuthenticated, tweetController.getTweets);
router.get("/tweets/:userId", isAuthenticated, tweetController.getTweetsOfUser);
module.exports = router;
