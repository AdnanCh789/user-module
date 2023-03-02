const { User } = require("../models/userModel");
const { validateUser } = require("../validators/userValidation");
const sendEmail = require("../utils/sendEmail");
const _ = require("lodash");
const crypto = require("crypto");
const expressJwt = require("express-jwt");
const catchAsync = require("../utils/catchAsync");

exports.validateSignup = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send({ status: false, data: {}, message: "User already exists.." });
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ status: false, data: {}, message: error.details[0].message });

  next();
};

exports.signup = catchAsync(async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send({ status: true, data: user, message: "Successfully Signed Up.." });
});

exports.signin = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({
      status: false,
      data: {},
      message: "Email or Password doesn't match, Please Signup..",
    });

  const result = await user.validatePassword(req.body);
  if (!result)
    return res.status(400).send({
      status: false,
      data: {},
      message: "Password Incorrect..",
    });
  const token = user.generateAuthToken();

  res.send({
    status: true,
    data: token,
    message: "Signed In successfully..",
  });
  next();
});

exports.signout = catchAsync(async (req, res, next) => {
  res.send({
    status: true,
    data: {},
    message: "Signed Out successfully..",
  });
  next();
});

exports.isAuth = catchAsync(async (req, res, next) => {
  const user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user)
    return res.status(401).send({
      status: false,
      data: {},
      message: "Access denied..",
    });
  next();
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(403).send({
      status: false,
      data: {},
      message: "Admin Resource! Access denied..",
    });
  next();
});

// exports.requireSignin = expressJwt({
//   secret: config.get("jwtPrivateKey"),
//   userProperty: "auth",
//   algorithms: ["HS256"],
// });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .send("This email is not registered, please send a valid email..");

  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/resetPassword/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n If You have not requested this email, than forget it`;
  console.log(message);
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery Email",
      message,
    });
    res.send(`Email send to ${user.email}`);
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return new Error("internal server error");
  }
});

exports.resetPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return res
      .status(400)
      .send(" Password reset token is invalid or has been expired");

  // if (req.body.password !== req.body.confirmPassword) {
  //   return res.status(400).send("Password doesnot match")
  // }

  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "role"]));
  next();
});
