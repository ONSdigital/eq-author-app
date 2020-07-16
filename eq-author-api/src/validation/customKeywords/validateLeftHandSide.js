const {
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
} = require("../../../constants/validationErrorCodes");

// const { some } = require("lodash");

const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const {
  ROUTING_ANSWER_TYPES,
} = require("../../../constants/routingAnswerTypes");

module.exports = function(ajv) {
  ajv.addKeyword("validateLeftHandSide", {
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];

      const dataPathArr = dataPath.split("/");
      const currentSectionIndex = dataPathArr[2];
      const currentPageIndex = dataPathArr[4];
      const currentPage =
        questionnaire.sections[currentSectionIndex].pages[currentPageIndex];

      console.log("\n\ncurrentPage = = = = ", currentPage);

      if (entityData && entityData.type === "Answer" && entityData.answerId) {
        console.log("\n\nWE HAVE AN ANSWER AVAILABLE!");
        const leftAnswerId = entityData.answerId;

        const previousAnswersForPage = getPreviousAnswersForPage(
          questionnaire,
          currentPage.id,
          false,
          ROUTING_ANSWER_TYPES
        );

        console.log("\n\npreviousAnswersForPage", previousAnswersForPage);

        // compare entityData.answerId against a list of available answers
        const leftAnswerInPreviousAnswers = previousAnswersForPage.some(
          el => el.id === leftAnswerId
        );
        console.log(
          "\n\nleftAnswerInPreviousAnswers",
          leftAnswerInPreviousAnswers
        );

        if (!leftAnswerInPreviousAnswers) {
          isValid.errors = [
            {
              keyword: "errorMessage",
              dataPath,
              message: ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
              params: {},
            },
          ];
          return false;
        }
      }

      // if (
      //   entityData &&
      //   entityData.type === "SelectedOptions" &&
      //   entityData.optionIds
      // ) {
      //   entityData.optionIds.map(optionId => {
      //     const option = getOptionById({ questionnaire }, optionId);
      //     if (option && option.mutuallyExclusive) {
      //       exclusiveOptionId = optionId;
      //     }
      //   });
      //   if (exclusiveOptionId) {
      //     if (parentData.condition === "AllOf") {
      //       isValid.errors = [
      //         {
      //           keyword: "errorMessage",
      //           dataPath,
      //           message: ERR_RIGHTSIDE_AND_OR_NOT_ALLOWED,
      //           params: {},
      //         },
      //       ];
      //       return false;
      //     }

      //     const expressionGroup = getExpressionGroupByExpressionId(
      //       { questionnaire },
      //       parentData.id
      //     );
      //     if (
      //       expressionGroup.operator === "And" &&
      //       entityData.optionIds.length > 1
      //     ) {
      //       isValid.errors = [
      //         {
      //           keyword: "errorMessage",
      //           dataPath,
      //           message: ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
      //           params: {},
      //         },
      //       ];
      //       return false;
      //     }

      //     const countCheckboxAnswers = filter(expressionGroup.expressions, {
      //       left: { answerId: parentData.left.answerId },
      //     }).length;
      //     if (expressionGroup.operator === "And" && countCheckboxAnswers > 1) {
      //       isValid.errors = [
      //         {
      //           keyword: "errorMessage",
      //           dataPath,
      //           message: ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
      //           params: {},
      //         },
      //       ];
      //       return false;
      //     }
      //   }
      // }
      return true;
    },
  });
};
