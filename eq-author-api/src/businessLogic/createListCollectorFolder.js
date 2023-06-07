const { v4: uuidv4 } = require("uuid");
const {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
} = require("./createListCollectorPages");

const createListCollectorFolder = () => ({
  id: uuidv4(),
  alias: "",
  title: "",
  listId: "",
  pages: [
    createListCollectorQualifierPage(),
    createListCollectorAddItemPage(),
    createListCollectorConfirmationPage(),
  ],
  displayName: "",
});

module.exports = createListCollectorFolder;
