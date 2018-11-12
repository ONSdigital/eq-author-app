/* eslint-disable no-unused-vars */
const ValidationError = require("../validation/ValidationError");

module.exports = function errorHandler(err, req, res, next) {
  req.log.error(err);

  const statusCode = err instanceof ValidationError ? 422 : 500;
  res.status(statusCode).json(err);
};
