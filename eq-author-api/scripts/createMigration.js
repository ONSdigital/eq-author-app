const { R_OK } = require("fs").constants;
const fs = require("fs").promises;
const { camelCase } = require("lodash");
const { logger } = require("../utils/logger");

const MIGRATIONS_INDEX_PATH = "migrations/index.js";

(async () => {
  if (process.argv.length < 3) {
    logger.error(
      "Not enough arguments provided to createMigration. Maybe the migration name is missing? Please refer to README."
    );
    process.exit(1);
  }

  const name = camelCase(process.argv[2]);
  const filename = `${name}.js`;
  const filePath = `migrations/${filename}`;

  let fileExists;
  try {
    await fs.access(filePath, R_OK);
    fileExists = true;
  } catch (e) {
    fileExists = false;
  }

  if (fileExists) {
    logger.error(`A migration with the name "${name}" already exists.`);
    process.exit(1);
  }

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

  await fs.writeFile(filePath, template);
  await fs.writeFile(`migrations/${name}.test.js`, testTemplate);

  const currentMigrationList = await fs.readFile(MIGRATIONS_INDEX_PATH, "utf8");
  const updatedMigrationList = currentMigrationList.replace(
    /];/,
    `  require('./${name}'),
];`
  );

  await fs.writeFile(MIGRATIONS_INDEX_PATH, updatedMigrationList);

  logger.info(`${name} migration successfully created`);
})().catch((e) => {
  logger.fatal(e);
  process.exit(1);
});
