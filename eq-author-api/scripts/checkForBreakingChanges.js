#!/usr/bin/env node
const chalk = require("chalk");
const schema = require("../schema/typeDefs");
const { buildSchema } = require("graphql");
const childProcess = require("child_process");
const fs = require("fs");
const findBreakingChanges = require("./findBreakingChanges");

const pinoMiddleware = require("express-pino-logger");
const pino = pinoMiddleware();
const logger = pino.logger;

const getMasterSchema = () => {
  childProcess.execSync(
    "git show origin/master:eq-author-api/schema/typeDefs.js > ./scripts/temp.js"
  );
  const schema = require("./temp.js");
  fs.unlinkSync("./scripts/temp.js");

  return schema;
};

try {
  buildSchema(schema);
  logger.info(chalk.green("Valid schema"));
} catch (e) {
  logger.error(chalk.red("Invalid schema:"));
  logger.error(e.message);
  process.exit(1);
}

const oldSchema = buildSchema(getMasterSchema());
const newSchema = buildSchema(schema);
const breakages = findBreakingChanges(oldSchema, newSchema);

if (breakages.length === 0) {
  logger.info(chalk.green("Changes are backwards compatible"));
} else {
  logger.error(chalk.red("Breaking changes found"));
  logger.error("Please deprecate these fields instead of removing:");

  breakages.forEach((breakage) => {
    logger.error(`  ${breakage.type}: ${breakage.description}`);
  });
  logger.info();
}
