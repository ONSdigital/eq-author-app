const { v4: uuidv4 } = require("uuid");

module.exports = (questionnaire) => {
  if (!questionnaire.colllectionLists) {
    questionnaire.collectionLists = {
      id: uuidv4(),
      lists: [],
    };
  }

  return questionnaire;
};
