const express = require("express");
const router = express.Router();
const {
  signup,
  validateSignup,
  signin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", [validateSignup, signup]);
router.post("/signin", signin);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);

module.exports = router;
