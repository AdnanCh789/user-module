const userRoutes = require("../routes/userRouter");
const authRoutes = require("../routes/authRouter");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

module.exports = (app) => {
  //middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));
  app.use(cors());

  //routes
  app.use("/api", authRoutes);
  app.use("/api/users", userRoutes);
};
