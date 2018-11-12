const createLogger = logger => ({
  log: err => {
    logger.error(err);
    return err;
  }
});

module.exports = createLogger;
