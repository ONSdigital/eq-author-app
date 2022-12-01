const executeQuery = require("../../executeQuery");

const deleteIntroductionPageMutation = `
  mutation DeleteIntroductionPage {
    deleteIntroductionPage {
        id
        introduction {
            id
        }
    }
  }
`;

const deleteIntroductionPage = async (ctx) => {
  const result = await executeQuery(deleteIntroductionPageMutation, {}, ctx);
  return result.data.deleteIntroductionPage;
};

module.exports = {
  deleteIntroductionPageMutation,
  deleteIntroductionPage,
};
