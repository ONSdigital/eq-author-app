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
  ...omit(input, "folderId"),
  answers: [createAnswer({ type: "Radio", isListCollectorPageType: true })],
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
  answers: [],
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
  ...omit(input, "folderId"),
  answers: [createAnswer({ type: "Radio", isListCollectorPageType: true })],
});

module.exports = {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
};
