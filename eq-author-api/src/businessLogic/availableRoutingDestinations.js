const { takeRightWhile } = require("lodash/fp");
const {
  getSectionByPageId,
  getPagesFromSection,
} = require("../../schema/resolvers/utils");

module.exports = (questionnaire, pageId) => {
  const ctx = { questionnaire };
  const section = getSectionByPageId(ctx, pageId);

  const questionPages = takeRightWhile(
    page => page.id !== pageId,
    getPagesFromSection(section)
  );

  const sections = takeRightWhile(
    futureSection => futureSection.id !== section.id,
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
