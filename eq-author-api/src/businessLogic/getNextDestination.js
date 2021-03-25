const { head, takeRightWhile, get } = require("lodash/fp");
const { END_OF_QUESTIONNAIRE } = require("../../constants/logicalDestinations");

const {
  getSectionByPageId,
  getPages,
} = require("../../schema/resolvers/utils/utils");

module.exports = (questionnaire, pageId) => {
  const currentSection = getSectionByPageId(questionnaire, pageId);
  const pagesAfterCurrent = takeRightWhile(
    (page) => page.id !== pageId,
    getPages({ questionnaire })
  );

  if (pagesAfterCurrent.length) {
    return {
      pageId: get("id", head(pagesAfterCurrent)),
    };
  }

  const sectionsAfterCurrent = takeRightWhile(
    (section) => section.id !== currentSection.id,
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
