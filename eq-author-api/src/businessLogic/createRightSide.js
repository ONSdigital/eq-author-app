const { RADIO } = require("../../constants/answerTypes");

module.exports = (firstAnswer) => {
  if (!firstAnswer) {
    return;
  }

  if (firstAnswer.type === RADIO) {
    return { type: "SelectedOptions", optionIds: [] };
  }
  return;
};
