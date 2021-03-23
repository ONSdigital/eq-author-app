const { takeRightWhile } = require("lodash/fp");
const { getPagesFromSection } = require("../../schema/resolvers/utils/pages");

const { getSectionByPageId } = require("../../schema/resolvers/utils/sections");

module.exports = (questionnaire, pageId) => {
  const ctx = { questionnaire };
  const section = getSectionByPageId(ctx, pageId);

  const questionPages = takeRightWhile(
    (page) => page.id !== pageId,
    getPagesFromSection(section)
  );

  const sections = takeRightWhile(
    (futureSection) => futureSection.id !== section.id,
    questionnaire.sections
  );

  const logicalDestinations = [
    {
      logicalDestination: "NextPage",
    },
    {
      logicalDestination: "EndOfQuestionnaire",
    },
  ];

  return {
    logicalDestinations,
    sections,
    questionPages,
  };
};
