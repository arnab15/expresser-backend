const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const Validator = require("../middlewares/Validator");
router.post("/signup", Validator("signup"), authController.signup);
router.post("/login", Validator("login"), authController.login);

module.exports = router;
