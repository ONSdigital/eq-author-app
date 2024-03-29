const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createListCollectorPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "ListCollectorPage",
  title: "",
  listId: "",
  drivingQuestion: "",
  pageDescription: "",
  additionalGuidancePanel: "",
  additionalGuidancePanelSwitch: false,
  drivingPositive: "Yes",
  drivingNegative: "No",
  drivingPositiveDescription: "",
  drivingNegativeDescription: "",
  anotherTitle: "",
  anotherPageDescription: "",
  anotherPositive: "Yes",
  anotherNegative: "No",
  anotherPositiveDescription: "",
  anotherNegativeDescription: "",
  addItemTitle: "",
  addItemPageDescription: "",
  routing: null,
  alias: "",
  ...omit(input, "folderId"),
});

module.exports = createListCollectorPage;
