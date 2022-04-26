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
  ListCollectorPage: "Untitled list collector",
};

const getName = (entity, typeName) => {
  let name;
  for (const attr of ["alias", "title", "label", "key"]) {
    name = entity[attr] && stripTags(entity[attr]).trim();
    if (name) {
      break;
    }
  }

  return name || defaultNames[typeName];
};

module.exports = {
  getName,
  defaultNames,
};
