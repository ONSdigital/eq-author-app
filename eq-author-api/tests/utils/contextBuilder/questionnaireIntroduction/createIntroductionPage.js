const executeQuery = require("../../executeQuery");

const createIntroductionPageMutation = `
  mutation CreateIntroductionPage {
    createIntroductionPage {
      id
      questionnaire {
        id
        introduction {
            id
        }
      }
    }
  }
`;

const createIntroductionPage = async (ctx) => {
  const result = await executeQuery(createIntroductionPageMutation, {}, ctx);
  return result.data.createIntroductionPage;
};

module.exports = {
  createIntroductionPageMutation,
  createIntroductionPage,
};
