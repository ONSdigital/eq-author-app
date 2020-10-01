const { takeRightWhile } = require("lodash/fp");
const {
  getSectionByPageId,
  getPages,
} = require("../../schema/resolvers/utils");

module.exports = (questionnaire, pageId) => {
  const section = getSectionByPageId(questionnaire, pageId);

  const questionPages = takeRightWhile(
    page => page.id !== pageId,
    getPages(section)
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
