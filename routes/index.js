const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./auth");
const profileRouter = require("./user");
const tweetRoute = require("./tweet.route");
apiRouter.use("/", authRouter);
apiRouter.use(profileRouter);
apiRouter.use(tweetRoute);
module.exports = apiRouter;
