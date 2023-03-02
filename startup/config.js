const config = require("config");

//logging errors if env. var are not set.

module.exports = () => {
  // To set the environment
  console.log("Environment =>", process.env.NODE_ENV);

  if (!process.env.NODE_ENV) {
    throw new Error("FATAL ERROR: environment is not defined.");
  }
  if (!config.get("jwtPrivateKey")) {
    throw new Error("jwt key is not defined.");
  }
};
