const removeExtraSpaces = (inputData) => {
  // Does not remove extra spaces from inputData if inputData is null or undefined
  if (inputData !== null && inputData !== undefined) {
    // If inputData is a string, remove extra spaces
    if (typeof inputData === "string") {
      // If inputData starts and end with HTML tags, remove extra spaces from the content inside the tags, including leading and trailing spaces
      if (/^<[^>]+>.*<\/[^>]+>$/.test(inputData)) {
        const startTags = inputData.substring(0, inputData.indexOf(">") + 1);
        const endTags = inputData.substring(inputData.lastIndexOf("<"));
        const inputDataContent = inputData.substring(
          startTags.length,
          inputData.lastIndexOf("<")
        );
        inputData = `${startTags}${inputDataContent
          .replace(/\s+/g, " ")
          .trim()}${endTags}`;
      } else {
        inputData = inputData.replace(/\s+/g, " ").trim();
      }
    }
    // If inputData is an array, recursively call removeExtraSpaces to remove extra spaces from each of its items
    else if (Array.isArray(inputData)) {
      inputData = inputData.map((item) => removeExtraSpaces(item));
    }
    // If inputData is an object, loop through each of its keys and recursively call removeExtraSpaces to remove extra spaces from each of its values
    else if (typeof inputData === "object") {
      Object.keys(inputData).forEach((key) => {
        inputData[key] = removeExtraSpaces(inputData[key]);
      });
    }
  }

  return inputData;
};

module.exports = removeExtraSpaces;
