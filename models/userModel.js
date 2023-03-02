const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    salt: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = config.get("salt");
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  validatePassword: async function (user) {
    return await bcrypt.compare(user.password, this.hashed_password);
  },
  generateAuthToken: function () {
    const token = jwt.sign(
      {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
      },
      config.get("jwtPrivateKey")
    );
    return token;
  },
  encryptedPassword: function (password) {
    if (!password) return (this.hashed_password = "");
    return (this.hashed_password = bcrypt.hashSync(this._password, this.salt));
  },

  getResetPasswordToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    return resetToken;
  },
};

module.exports.User = mongoose.model("User", userSchema);
