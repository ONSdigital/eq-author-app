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

  dataPath.splice(0, 1); // Strip leading ""

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

  for (let index = 0; index < dataPath.length; index += 2) {
    const val = dataPath[index];
    const nextVal = dataPath[index + 1];

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

        if (nextVal && nextVal !== "skipConditions") {
          confirmationOption = confirmation[nextVal];
          validationErr.confirmationOptionId = confirmationOption.id;
          validationErr.confirmationOptionType = nextVal;
          validationErr.type = "confirmationOption";
        } else {
          validationErr.type = "confirmation";
          index -= 1;
        }

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

        if (rule.expressionGroup) {
          validationErr.expressionGroupId = rule.expressionGroup.id;
        }
        break;

      case "skipConditions":
        skipConditions = confirmation
          ? confirmation.skipConditions
          : page.skipConditions;
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

  return validationErr;
};
