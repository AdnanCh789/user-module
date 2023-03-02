module.exports = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (ex) {
    next(ex);
  }
};
