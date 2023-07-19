const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createAnswer = require("./createAnswer");

const createListCollectorQualifierPage = (input = { position: 0 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorQualifierPage",
  title: "",
  pageDescription: "",
  alias: null,
  additionalGuidanceEnabled: false,
  additionalGuidanceContent: "",
  answers: [createAnswer({ type: "Radio", isListCollectorPageType: true })],
  ...omit(input, "folderId"),
});

const createListCollectorAddItemPage = (input = { position: 1 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorAddItemPage",
  title: "",
  pageDescription: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  alias: null,
  ...omit(input, "folderId"),
});

const createListCollectorConfirmationPage = (input = { position: 2 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorConfirmationPage",
  title: "",
  pageDescription: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  alias: null,
  answers: [createAnswer({ type: "Radio", isListCollectorPageType: true })],
  ...omit(input, "folderId"),
});

module.exports = {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
};
