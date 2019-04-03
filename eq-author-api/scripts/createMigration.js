const fs = require("fs").promises;
const chalk = require("chalk");
const { camelCase } = require("lodash");

if (process.argv.length < 3) {
  /* eslint-disable-next-line no-console */
  console.error(
    chalk.red(
      "Not enough arguments provided to createMigration. Maybe the migration name is missing? Please refer to README."
    )
  );
  process.exit(1);
}

const name = camelCase(process.argv[2]);
const filename = `${name}.js`;
const template = `//This is an auto-generated file.  Do NOT modify the method signature.

module.exports = function ${name}(questionnaire) {
  /**
    [Insert migration here]
   **/
  return questionnaire;
};
`;

const testTemplate = `const { cloneDeep } = require("lodash");
const ${name} = require("./${filename}");

describe("${name}", () => {
  // This test must remain for your migration to always work
  it("should be deterministic", () => {
    const questionnaire = {}; // Fill in the structure of the questionnaire here
    expect(${name}(cloneDeep(questionnaire))).toEqual(${name}(cloneDeep(questionnaire)));
  });

  it.todo("should...");
});

`;

fs.writeFile(`migrations/${filename}`, template);

fs.writeFile(`migrations/${name}.test.js`, testTemplate);

/* eslint-disable-next-line no-console */
console.info(
  chalk.green(
    `${name} migration successfully created. Remember to add this to 'migrations/index.js'`
  )
);
