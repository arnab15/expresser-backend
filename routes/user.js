const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
router.get("/profile/:username", userController.getUserProfileByUsername);
router.get("/profiles", isAuthenticated, userController.gerUserProfles);
router.post("/profile/follow/:profileId", isAuthenticated, userController.followProfile);
router.post("/profile/unfollow/:profileId", isAuthenticated, userController.unfollowProfile);
module.exports = router;
