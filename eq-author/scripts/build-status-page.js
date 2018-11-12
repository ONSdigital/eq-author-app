/* eslint-disable import/unambiguous, no-console */
const fs = require("fs");
const chalk = require("chalk");

const OUTPUT_PATH = "public/status.json";

const status = {
  status: "OK",
  version: process.env.EQ_AUTHOR_VERSION
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(status, null, "  "));

console.log(`
Status file written to: ${chalk.green(OUTPUT_PATH)}
`);
