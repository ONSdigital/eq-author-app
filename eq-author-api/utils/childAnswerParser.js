const { endsWith } = require("lodash/fp");

module.exports = id => {
  let answerType = {};
  if (endsWith("from", id)) {
    return answerType;
  } else if (endsWith("to", id)) {
    return "secondary";
  } else {
    return null;
  }
};
