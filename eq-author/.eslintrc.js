const path = require("path");
const schema = require("../eq-author-api/schema/typeDefs");

const config = {
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
    ],
  },
};

module.exports = {
  // parser: "@babel/eslint-parser",
  extends: [
    "eslint-config-eq-author",
    "eslint-config-eq-author/react",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: {
      version: "latest",
    },
    "import/resolver": {
      webpack: {
        config,
      },
    },
  },
  rules: {
    "react/jsx-no-bind": [2, { allowArrowFunctions: true }],
    "graphql/template-strings": [
      "error",
      {
        env: "literal",
        schemaString: schema,
      },
    ],
  },
  plugins: ["graphql"],
};
