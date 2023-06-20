const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createAnswer = require("./createAnswer");

const createListCollectorQualifierPage = (input = { position: 0 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorQualifierPage",
  title: "",
  pageDescription: "",
  description: "",
  displayName: "",
  alias: null,
  additionalGuidanceEnabled: false,
  additionalGuidanceContent: "",
  ...omit(input, "folderId"),
  answers: [createAnswer({ type: "Radio" })],
});

const createListCollectorAddItemPage = (input = { position: 1 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorAddItemPage",
  title: "",
  pageDescription: "",
  description: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  displayName: "",
  alias: null,
  ...omit(input, "folderId"),
  answers: [],
});

const createListCollectorConfirmationPage = (input = { position: 2 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorConfirmationPage",
  title: "",
  pageDescription: "",
  description: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  displayName: "",
  alias: null,
  ...omit(input, "folderId"),
  answers: [createAnswer({ type: "Radio" })],
});

module.exports = {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
};
