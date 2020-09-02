const { v4: uuidv4 } = require("uuid");

module.exports = (dataPath, field, errorCode, questionnaire) => {
  if (!dataPath || (typeof dataPath !== "string" && !Array.isArray(dataPath))) {
    throw new Error("Parameter 'dataPath' must be one of: String, Array");
  }

  if (!field) {
    throw new Error("Parameter 'field' must be supplied");
  }

  if (!errorCode) {
    throw new Error("Parameter 'errorCode' must be supplied");
  }

  if (!questionnaire) {
    throw new Error("Parameter 'questionnaire' must be supplied");
  }

  if (typeof dataPath === "string") {
    dataPath = dataPath.split("/");
  }

  let validationErr = {
    id: uuidv4(),
    keyword: "errorMessage",
    field,
    errorCode,
  };

  let section,
    page,
    confirmation,
    confirmationOption,
    answer,
    option,
    validation,
    routing,
    skipCondition,
    rule,
    expressionGroup,
    expression;

  dataPath.map((val, index) => {
    if (index % 2 !== 0) {
      switch (val) {
        case "sections": {
          const sectionIndex = dataPath[index + 1];
          const { sections } = questionnaire;
          section = sections[sectionIndex];
          validationErr.sectionId = section.id;
          validationErr.type = "section";
          break;
        }
        case "pages": {
          const pageIndex = dataPath[index + 1];
          const { pages } = section;
          page = pages[pageIndex];
          validationErr.pageId = page.id;
          validationErr.type = "page";
          break;
        }
        case "confirmation": {
          confirmation = page.confirmation;
          validationErr.confirmationId = confirmation.id;
          confirmationOption = dataPath[index + 1];

          if (confirmationOption) {
            const confirmationOptionJSON = confirmation[confirmationOption];
            validationErr.confirmationOptionId = confirmationOptionJSON.id;
            validationErr.confirmationOptionType = confirmationOption;
            validationErr.type = "confirmationOption";
            break;
          }

          validationErr.type = "confirmation";
          break;
        }
        case "answers": {
          const answerIndex = dataPath[index + 1];
          const { answers } = page;
          answer = answers[answerIndex];
          validationErr.answerId = answer.id;
          validationErr.type = "answer";
          break;
        }
        case "validation": {
          const validationProperty = dataPath[index + 1];
          validation = answer.validation;
          const propertyJSON = validation[validationProperty];
          validationErr.validationId = propertyJSON.id;
          validationErr.validationProperty = validationProperty;
          validationErr.type = "validation";
          break;
        }
        case "options": {
          const optionsIndex = dataPath[index + 1];
          const { options } = answer;
          option = options[optionsIndex];
          validationErr.optionId = option.id;
          validationErr.type = "option";
          break;
        }
        case "routing": {
          routing = page.routing;
          const ruleIndex = dataPath[index + 2];
          const { rules } = routing;
          rule = rules[ruleIndex];
          validationErr.routingRuleId = rule.id;
          validationErr.type = "routing";
          break;
        }
        case "skipConditions": {
          const skipConditions = page.skipConditions;
          const conditionIndex = dataPath[index + 1];
          skipCondition = skipConditions[conditionIndex];
          validationErr.skipConditionId = skipCondition.id;
          validationErr.type = "skipCondition";
          break;
        }
        case "expressions": {
          if (rule) {
            expressionGroup = rule.expressionGroup;
            const expressionIndex = dataPath[index + 1];
            expression = expressionGroup.expressions[expressionIndex];
          } else if (skipCondition) {
            const { expressions } = skipCondition;
            const expressionIndex = dataPath[index + 1];
            expression = expressions[expressionIndex];
          }

          if (expression) {
            validationErr.expressionId = expression.id;
            validationErr.type = "expression";
          }

          break;
        }
      }
    }
  });

  return validationErr;
};
