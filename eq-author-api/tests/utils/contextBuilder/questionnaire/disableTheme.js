const executeQuery = require("../../executeQuery");

const disableThemeMutation = `
mutation DisableTheme($input: DisableThemeInput!) {
    disableTheme(input: $input) {
      id
      shortName
      enabled
    }
  }
`;

const disableTheme = async (input, ctx) => {
  const result = await executeQuery(disableThemeMutation, { input }, ctx);
  return result.data.disableTheme;
};

module.exports = {
  disableThemeMutation,
  disableTheme,
};
