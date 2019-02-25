module.exports = (req, res, next) => {
  if (
    req.headers.clientversion &&
    process.env.EQ_AUTHOR_API_VERSION &&
    req.headers.clientversion !== process.env.EQ_AUTHOR_API_VERSION
  ) {
    req.log.warn(
      {
        clientversion: req.headers.clientversion,
        apiversion: process.env.EQ_AUTHOR_API_VERSION,
      },
      "Application version mismatch"
    );
  }
  next();
};
