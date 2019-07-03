const { RADIO } = require("../../constants/answerTypes");

module.exports = firstAnswer => {
  if (firstAnswer.type === RADIO) {
    return { type: "SelectedOptions", optionIds: [] };
  }
  return;
};
