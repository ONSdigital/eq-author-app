const { find, pick, isEmpty } = require("lodash");
const { stripTags } = require("./html");

const defaultNames = {
  Section: "Untitled section",
  QuestionPage: "Untitled question",
  CalculatedSummaryPage: "Untitled calculated summary",
  Option: "Untitled label",
  BasicAnswer: "Untitled answer",
  MultipleChoiceAnswer: "Untitled answer",
  CompositeAnswer: "Untitled answer",
  Metadata: "Untitled metadata",
  QuestionConfirmation: "Untitled confirmation question",
};

const getName = (entity, typeName) => {
  const title = find(
    pick(entity, ["alias", "title", "label", "key"]),
    (value) => {
      if (!value) {
        return false;
      }
      return !isEmpty(stripTags(value).trim());
    }
  );

  return title ? stripTags(title) : defaultNames[typeName];
};

module.exports = {
  getName,
  defaultNames,
};
