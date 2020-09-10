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

  let sections,
    section,
    pages,
    page,
    confirmation,
    answers,
    answer,
    options,
    option,
    confirmationOption,
    routing,
    rules,
    rule,
    skipConditions,
    skipCondition,
    expressionGroup,
    expressions,
    expression,
    validation,
    propertyJSON;

  dataPath.map((val, index) => {
    if (index % 2 !== 0) {
      switch (val) {
        case "sections":
          ({ sections } = questionnaire);
          section = sections[dataPath[index + 1]];
          validationErr.sectionId = section.id;
          validationErr.type = "section";
          break;

        case "pages":
          ({ pages } = section);
          page = pages[dataPath[index + 1]];
          validationErr.pageId = page.id;
          validationErr.type = "page";
          break;

        case "confirmation":
          confirmation = page.confirmation;
          validationErr.confirmationId = confirmation.id;

          if (dataPath[index + 1]) {
            confirmationOption = confirmation[dataPath[index + 1]];
            validationErr.confirmationOptionId = confirmationOption.id;
            validationErr.confirmationOptionType = dataPath[index + 1];
            validationErr.type = "confirmationOption";
            break;
          }

          validationErr.type = "confirmation";
          break;

        case "answers":
          ({ answers } = page);
          answer = answers[dataPath[index + 1]];
          validationErr.answerId = answer.id;
          validationErr.type = "answer";
          break;

        case "validation":
          validation = answer.validation;
          if (dataPath[index + 1]) {
            propertyJSON = validation[dataPath[index + 1]];
            validationErr.validationId = propertyJSON.id;
            validationErr.validationProperty = dataPath[index + 1];
          } else {
            validationErr.validationId = validation[field].id;
          }
          validationErr.type = "validation";
          break;

        case "options":
          ({ options } = answer);
          option = options[dataPath[index + 1]];
          validationErr.optionId = option.id;
          validationErr.type = "option";
          break;

        case "routing":
          routing = page.routing;
          ({ rules } = routing);
          rule = rules[dataPath[index + 2]];
          validationErr.routingRuleId = rule.id;
          validationErr.type = "routing";
          break;

        case "skipConditions":
          ({ skipConditions } = page);
          skipCondition = skipConditions[dataPath[index + 1]];
          validationErr.skipConditionId = skipCondition.id;
          validationErr.type = "skipCondition";
          break;

        case "expressions":
          if (rule) {
            expressionGroup = rule.expressionGroup;
            expression = expressionGroup.expressions[dataPath[index + 1]];
            validationErr.type = "routingExpression";
          } else if (skipCondition) {
            ({ expressions } = skipCondition);
            expression = expressions[dataPath[index + 1]];
            validationErr.type = "skipConditionExpression";
          }

          if (expression) {
            validationErr.expressionId = expression.id;
          }

          break;
      }
    }
  });

  return validationErr;
};
