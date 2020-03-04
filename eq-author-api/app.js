require("dotenv").config();

const { logger } = require("./utils/logger");

const { createApp } = require("./server");

const { PORT = 4000 } = process.env;
const server = createApp();

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚢  Listening on port ${PORT}`);
});
