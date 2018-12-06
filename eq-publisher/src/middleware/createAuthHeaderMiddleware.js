const setAuthHeader = require("./setAuthHeader");

module.exports = apolloFetch => (req, res, next) => {
  apolloFetch.use(setAuthHeader(res.locals.accessToken));
  next();
};