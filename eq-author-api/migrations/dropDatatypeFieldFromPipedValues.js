const { flatMap, get, set } = require("lodash");

module.exports = function dropDatatypeFieldFromPipedValues(questionnaire) {
  const regex = /\s?data-type="[^"]*"/g;

  const sections = flatMap(questionnaire.sections, (section) => section);
  const pages = flatMap(questionnaire.sections, (section) =>
    flatMap(section.pages, (page) => page)
  );

  const PIPEABLE_PAGE_FIELDS = [
    "title",
    "totalTitle",
    "description",
    "guidance",
    "additionalInfoContent",
    "confirmation.title",
  ];
  const PIPEABLE_SECTION_FIELDS = ["introductionTitle", "introductionContent"];

  const removePipe = (ctx, prop) => {
    const value = get(ctx, prop);
    if (typeof value === "string") {
      set(ctx, prop, value.replace(regex, ""));
    }
  };

  pages.forEach((page) => {
    PIPEABLE_PAGE_FIELDS.forEach((prop) => {
      removePipe(page, prop);
    });
  });

  sections.forEach((section) => {
    PIPEABLE_SECTION_FIELDS.forEach((prop) => {
      removePipe(section, prop);
    });
  });

  return questionnaire;
};
