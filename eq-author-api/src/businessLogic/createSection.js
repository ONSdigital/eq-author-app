const { v4: uuidv4 } = require("uuid");
const createFolder = require("./createFolder");

const createSection = (input = {}) => ({
  id: uuidv4(),
  title: "",
  pageDescription: "",
  introductionEnabled: false,
  introductionPageDescription: "",
  folders: [createFolder()],
  alias: "",
  requiredCompleted: false,
  showOnHub: true,
  sectionSummary: false,
  sectionSummaryPageDescription: "",
  repeatingSection: false,
  repeatingSectionListId: "",
  ...input,
});

module.exports = createSection;
