const removeExtraSpaces = (inputData) => {
  // Does not remove extra spaces from inputData if inputData is null or undefined
  if (inputData !== null && inputData !== undefined) {
    // If inputData is a string, remove extra spaces
    if (typeof inputData === "string") {
      inputData = inputData.replace(/\s+/g, " ").trim();
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
