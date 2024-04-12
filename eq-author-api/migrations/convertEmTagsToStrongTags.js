const convertEmTagsToStrongTags = (inputData) => {
  if (inputData !== null && inputData !== undefined) {
    if (typeof inputData === "string") {
      /* 
        Removes em tags wrapped in strong tags and em tags wrapped around strong tags before converting em tags 
        Prevents wrapping text in two strong tags when it was previously wrapped in both strong and em tags
      */
      inputData = inputData
        .replace(/<strong><em>|<em><strong>/g, "<strong>")
        .replace(/<\/em><\/strong>|<\/strong><\/em>/g, "</strong>")
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
