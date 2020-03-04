/* eslint-disable import/unambiguous,  */
const fs = require("fs");
const chalk = require("chalk");
const { logger } = require("../src/utils/logger");

const OUTPUT_PATH = "public/status.json";

const status = {
  status: "OK",
  version: process.env.REACT_APP_EQ_AUTHOR_VERSION,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(status, null, "  "));

logger.info(`
Status file written to: ${chalk.green(OUTPUT_PATH)}
`);
