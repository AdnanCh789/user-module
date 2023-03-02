const mongoose = require("mongoose");
const config = require("config");

module.exports = () => {
  mongoose
    .set("strictQuery", false)
    .connect(config.get("db"), { useNewUrlParser: true })
    .then(() => {
      console.log("You are connected to MongoDB");
    })
    .catch((err) => {
      console.error("Something Went Wrong..", err);
    });
};
