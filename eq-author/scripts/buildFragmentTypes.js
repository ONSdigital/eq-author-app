#!/usr/bin/env node
/* eslint-disable import/unambiguous, */
const { makeExecutableSchema } = require("graphql-tools");
const { graphql } = require("graphql");
const chalk = require("chalk");
const schema = require("../../eq-author-api/schema/typeDefs");
const fs = require("fs");
const { logger } = require("../src/utils/logger");

const pathToSave = process.argv[2];
if (!pathToSave) {
  console.error(chalk.red("Please provide where to save the file."));
  process.exit(1);
}

const writeFile = (path, contents) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, contents, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(contents);
      }
    });
  });
};

const fragmentMatcherQuery = `
  query Introspection {
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }
`;

const fetchIntrospectionFragmentMatcher = (typeDefs) => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });

  return graphql(schema, fragmentMatcherQuery).then((result) => {
    result.data.__schema.types = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    );

    return result.data;
  });
};

const generateIntrospectionFragmentMatcher = (schema, outPath) => {
  return fetchIntrospectionFragmentMatcher(schema).then((result) =>
    writeFile(outPath, JSON.stringify(result))
  );
};

generateIntrospectionFragmentMatcher(schema, pathToSave)
  .then((res) => {
    logger.info("Fragment types file built at " + pathToSave);
  })
  .catch((e) => {
    logger.error("Fragment types file build failed: ", e);
  });
