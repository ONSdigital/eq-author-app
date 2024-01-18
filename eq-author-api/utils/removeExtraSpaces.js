const removeExtraSpaces = (inputObject) => {
  if (inputObject) {
    Object.keys(inputObject).forEach((key) => {
      if (typeof inputObject[key] === "string") {
        inputObject[key] = inputObject[key].replace(/\s+/g, " ");
      } else if (Array.isArray(inputObject[key])) {
        inputObject[key] = inputObject[key].map((item) => {
          if (typeof item === "object") {
            return removeExtraSpaces(item);
          } else {
            return item.replace(/\s+/g, " ");
          }
        });
      } else if (typeof inputObject[key] === "object") {
        inputObject[key] = removeExtraSpaces(inputObject[key]);
      }
    });
  }

  return inputObject;
};

module.exports = removeExtraSpaces;
