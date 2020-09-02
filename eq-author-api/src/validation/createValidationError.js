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

  let sectionIndex,
    sections,
    section,
    pageIndex,
    pages,
    page,
    confirmation,
    answerIndex,
    answers,
    answer,
    optionsIndex,
    options,
    option,
    confirmationOptionIndex,
    confirmationOption,
    routing,
    ruleIndex,
    rules,
    rule,
    skipConditions,
    skipConditionIndex,
    skipCondition,
    expressionGroup,
    expressionIndex,
    expressions,
    expression,
    validationProperty,
    validation,
    propertyJSON;

  dataPath.map((val, index) => {
    if (index % 2 !== 0) {
      switch (val) {
        case "sections":
          sectionIndex = dataPath[index + 1];
          ({ sections } = questionnaire);
          section = sections[sectionIndex];
          validationErr.sectionId = section.id;
          validationErr.type = "section";
          break;

        case "pages":
          pageIndex = dataPath[index + 1];
          ({ pages } = section);
          page = pages[pageIndex];
          validationErr.pageId = page.id;
          validationErr.type = "page";
          break;

        case "confirmation":
          confirmation = page.confirmation;
          validationErr.confirmationId = confirmation.id;
          confirmationOptionIndex = dataPath[index + 1];

          if (confirmationOptionIndex) {
            confirmationOption = confirmation[confirmationOptionIndex];
            validationErr.confirmationOptionId = confirmationOption.id;
            validationErr.confirmationOptionType = confirmationOptionIndex;
            validationErr.type = "confirmationOption";
            break;
          }

          validationErr.type = "confirmation";
          break;

        case "answers":
          answerIndex = dataPath[index + 1];
          ({ answers } = page);
          answer = answers[answerIndex];
          validationErr.answerId = answer.id;
          validationErr.type = "answer";
          break;

        case "validation":
          validationProperty = dataPath[index + 1];
          validation = answer.validation;
          propertyJSON = validation[validationProperty];
          validationErr.validationId = propertyJSON.id;
          validationErr.validationProperty = validationProperty;
          validationErr.type = "validation";
          break;

        case "options":
          optionsIndex = dataPath[index + 1];
          ({ options } = answer);
          option = options[optionsIndex];
          validationErr.optionId = option.id;
          validationErr.type = "option";
          break;

        case "routing":
          routing = page.routing;
          ruleIndex = dataPath[index + 2];
          ({ rules } = routing);
          rule = rules[ruleIndex];
          validationErr.routingRuleId = rule.id;
          validationErr.type = "routing";
          break;

        case "skipConditions":
          ({ skipConditions } = page);
          skipConditionIndex = dataPath[index + 1];
          skipCondition = skipConditions[skipConditionIndex];
          validationErr.skipConditionId = skipCondition.id;
          validationErr.type = "skipCondition";
          break;

        case "expressions":
          if (rule) {
            expressionGroup = rule.expressionGroup;
            expressionIndex = dataPath[index + 1];
            expression = expressionGroup.expressions[expressionIndex];
          } else if (skipCondition) {
            ({ expressions } = skipCondition);
            expressionIndex = dataPath[index + 1];
            expression = expressions[expressionIndex];
          }

          if (expression) {
            validationErr.expressionId = expression.id;
            validationErr.type = "expression";
          }

          break;
      }
    }
  });

  return validationErr;
};
