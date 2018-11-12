#!/usr/bin/env node

const chalk = require("chalk");
const schema = require("../");
const { buildSchema } = require("graphql");
const childProcess = require("child_process");
const fs = require("fs");
const findBreakingChanges = require("./findBreakingChanges");

const getMasterSchema = () => {
  childProcess.execSync("git show origin/master:index.js > ./scripts/temp.js");
  const schema = require("./temp.js");
  fs.unlinkSync("./scripts/temp.js");

  return schema;
};

try {
  buildSchema(schema);
  console.log(chalk.green("Valid schema"));
} catch (e) {
  console.error(chalk.red("Invalid schema:"));
  console.error(e.message);

  process.exitCode = 1;
  return;
}

const oldSchema = buildSchema(getMasterSchema());
const newSchema = buildSchema(schema);
const breakages = findBreakingChanges(oldSchema, newSchema);

if (breakages.length === 0) {
  console.log(chalk.green("Changes are backwards compatible"));
} else {
  console.error(chalk.red("Breaking changes found"));
  console.error("Please deprecate these fields instead of removing:");

  breakages.forEach(breakage => {
    console.error(`  ${breakage.type}: ${breakage.description}`);
  });
  console.log();

  process.exitCode = 1;
}
