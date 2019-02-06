const executeQuery = require("../../executeQuery");

const createAnswerMutation = `
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
      description
      guidance
      qCode
      label
      type
      ... on MultipleChoiceAnswer {
        options {
          id
          additionalAnswer {
            id
            type
          }
        }
      }
    }
  }
`;

const createAnswer = async (questionnaire, { id: pageId }, type) => {
  const input = {
    description: "",
    guidance: "",
    label: `${type} answer`,
    qCode: null,
    type: `${type}`,
    questionPageId: pageId,
  };

  const result = await executeQuery(
    createAnswerMutation,
    { input },
    questionnaire
  );

  return result.data.createAnswer;
};

module.exports = {
  createAnswerMutation,
  createAnswer,
};
