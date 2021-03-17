const executeQuery = require("../../executeQuery");

const enableThemeMutation = `
mutation EnableTheme($input: EnableThemeInput!) {
    enableTheme(input: $input) {
      id
      shortName
      enabled
    }
  }
`;

const enableTheme = async (input, ctx) => {
  const result = await executeQuery(enableThemeMutation, { input }, ctx);
  return result.data.enableTheme;
};

module.exports = {
  enableThemeMutation,
  enableTheme,
};
