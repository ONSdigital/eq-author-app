const executeQuery = require("../../executeQuery");

const updateThemeMutation = `
mutation UpdateTheme($input: UpdateThemeInput!) {
    updateTheme(input: $input) {
      id
      shortName
      enabled
      eqId
      legalBasisCode
      formType
      validationErrorInfo {
        id
        totalCount
      }
    }
  }
`;

const updateTheme = async (input, ctx) => {
  const result = await executeQuery(updateThemeMutation, { input }, ctx);
  return result.data.updateTheme;
};

module.exports = {
  updateThemeMutation,
  updateTheme,
};
