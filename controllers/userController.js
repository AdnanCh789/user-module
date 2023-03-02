const { User } = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const _ = require("lodash");
// const sendNotification = require("../utils/sendNotification");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  let allUsers = [];
  users.map((user) =>
    allUsers.push(_.pick(user, ["_id", "name", "email", "phone", "role"]))
  );
  res.send(allUsers);
});

exports.deleteUserById = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.profile._id);
  if (!user) return res.send({ message: "No user found for this id.." });
  res.send({ user, message: "This user has been deleted.." });
});

exports.updateUserById = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { $new: true }
  );

  await user.save();
  const token = user.generateAuthToken();
  res.send(token);
});

exports.getUserById = async (req, res, next) => {
  const user = req.profile;
  if (!user) return res.status(400).send("No user found..");
  res.send(_.pick(user, ["_id", "name", "email", "role"]));
};

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) return res.status(400).send("No user found..");
  req.profile = user;
  next();
};
