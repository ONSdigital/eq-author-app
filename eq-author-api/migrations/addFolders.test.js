const addFolders = require("./addFolders");

describe("", () => {
  const questionnaireContext = (sections) => ({
    id: "questionnaire-1",
    sections,
  });

  const sectionInput = (array, input = null) =>
    array.map((item) => ({ ...item, ...input }));

  let defaultSections = [
    {
      id: "section-1",
    },
    {
      id: "section-2",
    },
    {
      id: "section-3",
    },
  ];

  it("should not perform migration if folders are present", () => {
    const sections = sectionInput(defaultSections, { folders: [{}] });
    const questionnaire = questionnaireContext(sections);

    expect(addFolders(questionnaire)).toEqual(questionnaire);
  });

  it("should perform migration if folders are present", () => {
    const sections = sectionInput(defaultSections, { pages: [{}] });
    const questionnaire = questionnaireContext(sections);
    const addedFolders = addFolders(questionnaire);

    addedFolders.sections.forEach((section) => {
      expect(section.folders).toBeTruthy();
      expect(section.pages).toBeUndefined();
    });
  });
});
