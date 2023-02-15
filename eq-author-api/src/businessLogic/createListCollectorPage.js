const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createListCollectorPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "ListCollectorPage",
  title: "",
  listId: "",
  drivingQuestion: "",
  additionalGuidancePanel: "",
  additionalGuidancePanelSwitch: false,
  drivingId: uuidv4(),
  drivingPositive: "Yes",
  drivingNegative: "No",
  drivingPositiveDescription: "",
  drivingNegativeDescription: "",
  anotherId: uuidv4(),
  anotherTitle: "",
  anotherPositive: "Yes",
  anotherNegative: "No",
  anotherPositiveDescription: "",
  anotherNegativeDescription: "",
  addItemTitle: "",
  routing: null,
  alias: "",
  ...omit(input, "folderId"),
});

module.exports = createListCollectorPage;
