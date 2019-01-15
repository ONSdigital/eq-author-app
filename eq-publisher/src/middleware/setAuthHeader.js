module.exports = accessToken => ({ options }, next) => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers.authorization = `Bearer ${accessToken}`;

  next();
};
