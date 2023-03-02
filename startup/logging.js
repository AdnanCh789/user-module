module.exports = () => {
  //catching uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
    console.log(err);
    console.log(err.message, err.name);
    process.exit(1);
  });
};
