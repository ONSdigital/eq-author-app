const { find, some, head, takeRightWhile, get } = require("lodash/fp");
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
      pageId: get("id", head(pagesAfterCurrent)),
    };
  }

  const sectionsAfterCurrent = takeRightWhile(
    section => section.id !== currentSection.id,
    questionnaire.sections
  );
  if (sectionsAfterCurrent.length) {
    return {
      sectionId: get("id", head(sectionsAfterCurrent)),
    };
  }

  return {
    logical: END_OF_QUESTIONNAIRE,
  };
};
