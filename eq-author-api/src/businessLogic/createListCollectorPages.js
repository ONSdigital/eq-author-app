const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createAnswer = require("./createAnswer");
const createOption = require("./createOption");

const positiveOption = createOption({ label: "Yes" });
const negativeOption = createOption({ label: "No" });
const defaultOptions = [positiveOption, negativeOption];

const createListCollectorQualifierPage = (input = { position: 0 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorQualifierPage",
  title: "",
  pageDescription: "",
  alias: null,
  additionalGuidanceEnabled: false,
  additionalGuidanceContent: "",
  answers: [
    createAnswer({
      label: "",
      type: "Radio",
      options: defaultOptions,
    }),
  ],
  ...omit(input, "folderId"),
});

const createListCollectorAddItemPage = (input = { position: 1 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorAddItemPage",
  title: "",
  pageDescription: "",
  alias: null,
  ...omit(input, "folderId"),
});

const createListCollectorConfirmationPage = (input = { position: 2 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorConfirmationPage",
  title: "",
  pageDescription: "",
  alias: null,
  answers: [
    createAnswer({
      label: "",
      type: "Radio",
      options: defaultOptions,
    }),
  ],
  ...omit(input, "folderId"),
});

module.exports = {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
};
