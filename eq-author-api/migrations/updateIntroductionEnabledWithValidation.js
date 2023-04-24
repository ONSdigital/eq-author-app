module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    if (section.introductionTitle || section.introductionContent) {
      section.introductionEnabled = true;
    } else {
      section.introductionEnabled = false;
    }

    // Adds validation errors
    if (
      section.introductionTitle === undefined ||
      section.introductionTitle === null
    ) {
      section.introductionTitle = "";
    }

    if (
      section.introductionContent === undefined ||
      section.introductionContent === null
    ) {
      section.introductionContent = "";
    }
  });

  return questionnaire;
};
