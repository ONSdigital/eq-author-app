const { querySection, querySectionMutation } = require("./querySection");

const { createSection, createSectionMutation } = require("./createSection");

const { deleteSection, deleteSectionMutation } = require("./deleteSection");

const {
  duplicateSection,
  duplicateSectionMutation,
} = require("./duplicateSection");

module.exports = {
  querySection,
  querySectionMutation,
  createSection,
  createSectionMutation,
  deleteSection,
  deleteSectionMutation,
  duplicateSection,
  duplicateSectionMutation,
};
