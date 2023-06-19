const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createAnswer = require("./createAnswer");

const createListCollectorQualifierPage = (input = { position: 0 }) => ({
  id: uuidv4(),
  pageType: "ListCollectorQualifierPage",
  title: "",
  pageDescription: "",
  description: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  answers: [createAnswer({ type: "Radio" })],
  displayName: "",
  routing: null,
  alias: null,
  ...omit(input, "folderId"),
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
  answers: [],
  routing: null,
  alias: null,
  ...omit(input, "folderId"),
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
  answers: [createAnswer({ type: "Radio" })],
  displayName: "",
  routing: null,
  alias: null,
  ...omit(input, "folderId"),
});

module.exports = {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
};
