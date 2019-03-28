const executeQuery = require("../../executeQuery");

const createRoutingMutation = `
mutation createRouting2($input: CreateRouting2Input!) {
  createRouting2(input: $input) {
    id
    rules {
      id
      expressionGroup {
        id
        expressions {
          ...on BinaryExpression2 {
            id
            left {
              ... on BasicAnswer {
                id
              }
              ... on MultipleChoiceAnswer {
                id
              }
            }
            right {
              ... on SelectedOptions2 {
                options {
                  id
                }
              }
              ... on CustomValue2 {
                number
              }
            }
          }  
        }
      }
    }
    else {
      logical
      page {
        id
      }
      section {
        id
      }
    }   
  }
}`;

const createRouting = async (questionnaire, page) => {
  const input = {
    pageId: page.id,
  };
  const result = await executeQuery(
    createRoutingMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.createRouting2;
};

module.exports = {
  createRoutingMutation,
  createRouting,
};
