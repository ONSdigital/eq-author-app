const { find, pick, isEmpty } = require("lodash");
const { stripTags } = require("./html");

const defaultNames = {
  Section: "Untitled Section",
  QuestionPage: "Untitled Page",
  Option: "Untitled Label",
  BasicAnswer: "Untitled Answer",
  MultipleChoiceAnswer: "Untitled Answer",
  CompositeAnswer: "Untitled Answer",
  Metadata: "Untitled Metadata"
};

const getName = (entity, typeName) => {
  const title = find(
    pick(entity, ["alias", "title", "label", "key"]),
    value => {
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
  defaultNames
};
