const fs = require("fs").promises;
const chalk = require("chalk");

if (process.argv.length < 3) {
  /* eslint-disable-next-line no-console */
  console.error(
    chalk.red(
      "Not enough arguments provided to createMigration. Maybe the migration name is missing? Please refer to README."
    )
  );
  process.exit(1);
}

const name = process.argv[2];
const filename = `${name}.js`;

fs.readFile("scripts/migration.template.js").then(data => {
  fs.writeFile(`migrations/${filename}`, data);
});

/* eslint-disable-next-line no-console */
console.info(
  chalk.green(
    `${name} migration successfully created. Remember to add this to 'migrations/index.js'`
  )
);
