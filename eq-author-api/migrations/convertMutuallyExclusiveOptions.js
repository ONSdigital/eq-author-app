const { getPageById } = require("../schema/resolvers/utils");
const createAnswer = require("../src/businessLogic/createAnswer");

module.exports = (questionnaire) => {
  const ctx = { questionnaire };
  questionnaire?.sections?.forEach((section) => {
    section?.folders?.forEach((folder) => {
      folder?.pages?.forEach((page) => {
        page?.answers?.forEach((answer) => {
          if (answer.options !== undefined && answer.options !== null) {
            answer.options.forEach((option) => {
              if (option.mutuallyExclusive) {
                const mutuallyExclusiveAnswer = createAnswer(
                  {
                    type: "MutuallyExclusive",
                    questionPageId: page.id,
                  },
                  getPageById(ctx, page.id)
                );

                mutuallyExclusiveAnswer.options[0].label = option.label;
                page.answers.push(mutuallyExclusiveAnswer);
                if (answer.options.length > 1) {
                  answer.options = answer.options.filter(
                    (option) => !option.mutuallyExclusive
                  );
                } else {
                  answer.options = undefined;
                }
              }
            });
          }
        });
      });
    });
  });

  return questionnaire;
};
