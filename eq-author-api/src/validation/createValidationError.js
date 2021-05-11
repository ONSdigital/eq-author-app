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
    folders,
    folder,
    pages,
    page,
    confirmation,
    answers,
    answer,
    options,
    option,
    confirmationOption,
    routing,
    rule,
    skipConditions,
    skipCondition,
    expressionGroup,
    expression,
    validation,
    theme,
    propertyJSON;

  for (let index = 0; index < dataPath.length; index++) {
    const val = dataPath[index];
    const nextVal = dataPath[index + 1];

    switch (val) {
      case "themeSettings":
        validationErr.type = "themeSettings";
        break;

      case "themes":
        theme = questionnaire.themes[nextVal ? nextVal : field];
        validationErr.type = "theme";
        validationErr.themeId = theme?.id;
        break;

      case "sections":
        ({ sections } = questionnaire);
        section = sections[nextVal];
        validationErr.sectionId = section.id;
        validationErr.type = "section";
        break;

      case "folders":
        ({ folders } = section);
        folder = folders[nextVal];
        validationErr.folderId = folder.id;
        validationErr.type = "folders";
        break;

      case "pages":
        ({ pages } = folder);
        page = pages[nextVal];
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
        }

        break;

      case "answers":
        ({ answers } = page);
        answer = answers[nextVal];
        validationErr.answerId = answer.id;
        validationErr.type = "answer";
        break;

      case "validation":
        validation = answer.validation;
        if (nextVal) {
          propertyJSON = validation[nextVal];
          validationErr.validationId = propertyJSON.id;
          validationErr.validationProperty = nextVal;
        } else {
          validationErr.validationId = validation[field].id;
        }
        validationErr.type = "validation";
        break;

      case "options":
        ({ options } = answer);
        option = options[nextVal];
        validationErr.optionId = option.id;
        validationErr.type = "option";
        break;

      case "additionalAnswer":
        validationErr.answerId = option.additionalAnswer.id;
        validationErr.type = "option-additionalAnswer";
        break;

      case "routing":
        validationErr.type = "routing";
        routing = page.routing;
        break;

      case "rules":
        rule = routing.rules[nextVal];
        validationErr.routingRuleId = rule.id;
        break;

      case "else":
        validationErr.destinationId = routing.else.id;
        break;

      case "expressionGroup":
        expressionGroup = rule.expressionGroup;
        validationErr.expressionGroupId = expressionGroup.id;
        break;

      case "destination":
        validationErr.destinationId = rule.destination.id;
        break;

      case "skipConditions":
        skipConditions = // TODO: Use optional chaining syntax when eslint upgraded
          (confirmation && confirmation.skipConditions) ||
          (page && page.skipConditions) ||
          (folder && folder.skipConditions);
        skipCondition = skipConditions[nextVal];
        validationErr.skipConditionId = skipCondition.id;
        validationErr.type = "skipCondition";
        break;

      case "expressions":
        expressionGroup = expressionGroup || skipCondition;
        validationErr.type = skipCondition
          ? "skipConditionExpression"
          : "routingExpression";
        expression = expressionGroup.expressions[nextVal];
        validationErr.expressionId = expression.id;
        break;
    }
  }

  return validationErr;
};
