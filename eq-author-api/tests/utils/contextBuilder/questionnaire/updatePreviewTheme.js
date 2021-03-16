const executeQuery = require("../../executeQuery");

const updatePreviewThemeMutation = `
mutation UpdatePreviewTheme($input: UpdatePreviewThemeInput!) {
    updatePreviewTheme(input: $input) {
      id
      previewTheme
    }
  }
`;

const updatePreviewTheme = async (input, ctx) => {
  const result = await executeQuery(updatePreviewThemeMutation, { input }, ctx);
  return result.data.updatePreviewTheme;
};

module.exports = {
  updatePreviewThemeMutation,
  updatePreviewTheme,
};
