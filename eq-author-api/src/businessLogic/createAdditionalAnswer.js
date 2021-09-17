const createAnswer = require("./createAnswer");
const { TEXTFIELD } = require("../../constants/answerTypes");

module.exports = () =>
  createAnswer({
    description: "",
    label: "",
    qCode: "",
    type: TEXTFIELD,
  });
