const convertEmTagsToStrongTags = (inputData) => {
  if (inputData !== null && inputData !== undefined) {
    if (typeof inputData === "string") {
      inputData = inputData
        .replace(/<em>/g, "<strong>")
        .replace(/<\/em>/g, "</strong>");
    } else if (Array.isArray(inputData)) {
      inputData = inputData.map((item) => convertEmTagsToStrongTags(item));
    } else if (typeof inputData === "object") {
      Object.keys(inputData).forEach((key) => {
        inputData[key] = convertEmTagsToStrongTags(inputData[key]);
      });
    }
  }

  return inputData;
};

module.exports = (questionnaire) => convertEmTagsToStrongTags(questionnaire);
