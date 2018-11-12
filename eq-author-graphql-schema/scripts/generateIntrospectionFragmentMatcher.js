#!/usr/bin/env node

const { makeExecutableSchema } = require("graphql-tools");
const { graphql } = require("graphql");
const chalk = require("chalk");
const schema = require("../");
const fs = require("fs");

const writeFile = (path, contents) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, contents, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(contents);
      }
    });
  });
}

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

const fetchIntrospectionFragmentMatcher = (typeDefs)  => {

  const schema = makeExecutableSchema({ typeDefs, resolverValidationOptions: {requireResolversForResolveType: false} });

  return graphql(schema, fragmentMatcherQuery).then(result => {
    result.data.__schema.types = result.data.__schema.types.filter(
      type => type.possibleTypes !== null
    );

    return result.data;
  });
}

const generateIntrospectionFragmentMatcher = (schema, outPath) => {
  return fetchIntrospectionFragmentMatcher(schema).then(result =>
    writeFile(outPath, JSON.stringify(result))
  )
}

const fileName = "./fragmentTypes.json"

generateIntrospectionFragmentMatcher(schema, fileName).then(res => {
  console.log(chalk.green("Fragment types file built at " + fileName));
}).catch(e => {
  console.error(chalk.red("Fragment types file build failed: "), e);
})
