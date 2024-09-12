const { v4: uuidv4 } = require("uuid");

module.exports = (dataPath, field, errorCode, questionnaire, errMessage) => {
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

  if (!errMessage) {
    errMessage = "";
  }

  if (typeof dataPath === "string") {
    dataPath = dataPath.split("/");
  }

  let validationErr = {
    id: uuidv4(),
    keyword: "errorMessage",
    field,
    errorCode,
    message: errMessage,
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
    displayConditions,
    displayCondition,
    expressionGroup,
    expression,
    validation,
    list,
    propertyJSON;

  if (!dataPath.length && field) {
    // If dataPath is empty, the error is on the root questionnaire object
    validationErr.type = "root";
  }

  for (let index = 0; index < dataPath.length; index++) {
    const val = dataPath[index];
    const nextVal = dataPath[index + 1];

    switch (val) {
      case "introduction":
        validationErr.type = "introduction";
        break;

      case "lists":
        list = questionnaire.collectionLists.lists[nextVal];
        validationErr.type = "list";
        validationErr.listId = list?.id;
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
        ({ answers } = page || list);
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

      case "displayConditions":
        displayConditions = section.displayConditions;
        displayCondition = displayConditions[nextVal];
        validationErr.displayConditionId = displayCondition.id;
        validationErr.type = "displayCondition";
        break;

      case "expressions":
        expressionGroup = expressionGroup || skipCondition || displayCondition;
        if (expressionGroup) {
          validationErr.type = "routingExpression";
        }
        if (skipCondition) {
          validationErr.type = "skipConditionExpression";
        }
        if (displayCondition) {
          validationErr.type = "displayConditionExpression";
        }
        expression = expressionGroup.expressions[nextVal];
        validationErr.expressionId = expression?.id;
        break;

      case "submission":
        validationErr.type = "submission";
        break;
    }
  }

  return validationErr;
};
