const { v4: uuidv4 } = require("uuid");
const createQuestionPage = require("./createQuestionPage");

const createListCollectorFolder = () => ({
  id: uuidv4(),
  alias: "",
  title: "",
  listId: "",
  pages: [createQuestionPage()],
  displayName: "",
});

module.exports = createListCollectorFolder;
