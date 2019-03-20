const { find, some, takeRightWhile } = require("lodash/fp");

module.exports = (questionnaire, pageId) => {
  const section = find(section => {
    if (section.pages && some({ id: pageId }, section.pages)) {
      return section;
    }
  }, questionnaire.sections);

  const questionPages = takeRightWhile(
    page => page.id !== pageId,
    section.pages
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
