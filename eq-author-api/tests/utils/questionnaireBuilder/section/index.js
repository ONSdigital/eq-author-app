const { querySection, querySectionMutation } = require("./querySection");

const { createSection, createSectionMutation } = require("./createSection");

const { updateSection, updateSectionMutation } = require("./updateSection");

const { deleteSection, deleteSectionMutation } = require("./deleteSection");

const {
  duplicateSection,
  duplicateSectionMutation,
} = require("./duplicateSection");

const { moveSection, moveSectionMutation } = require("./moveSection");

module.exports = {
  querySection,
  querySectionMutation,
  createSection,
  createSectionMutation,
  updateSection,
  updateSectionMutation,
  deleteSection,
  deleteSectionMutation,
  duplicateSection,
  duplicateSectionMutation,
  moveSection,
  moveSectionMutation,
};
