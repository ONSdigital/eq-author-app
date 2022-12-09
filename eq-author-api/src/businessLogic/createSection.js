const { v4: uuidv4 } = require("uuid");
const createFolder = require("./createFolder");

const createSection = (input = {}) => ({
  id: uuidv4(),
  title: "",
  pageDescription: "",
  introductionEnabled: false,
  folders: [createFolder()],
  alias: "",
  requiredCompleted: false,
  showOnHub: true,
  sectionSummary: false,
  ...input,
});

module.exports = createSection;
