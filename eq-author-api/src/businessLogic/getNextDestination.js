const { find, some, head, takeRightWhile } = require("lodash/fp");
const { END_OF_QUESTIONNAIRE } = require("../../constants/logicalDestinations");

module.exports = (questionnaire, pageId) => {
  const currentSection = find(section => {
    if (section.pages && some({ id: pageId }, section.pages)) {
      return section;
    }
  });

  const pagesAfterCurrent = takeRightWhile(
    page => page.id !== pageId,
    currentSection.pages
  );
  if (pagesAfterCurrent.length) {
    return {
      entityType: "Page",
      result: head(pagesAfterCurrent),
    };
  }

  const sectionsAfterCurrent = takeRightWhile(
    section => section.id !== currentSection.id,
    questionnaire.sections
  );
  if (sectionsAfterCurrent.length) {
    return {
      entityType: "Section",
      result: head(sectionsAfterCurrent),
    };
  }

  return {
    result: END_OF_QUESTIONNAIRE,
  };
};
