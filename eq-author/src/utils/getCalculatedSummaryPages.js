const insertSection = (sections, section, folder, page, answers) => {
  sections.push({
    ...section,
    folders: [],
  });
  sections = insertFolder(sections, folder, page, answers);
  return sections;
};

const insertFolder = (sections, folder, page, answers) => {
  sections[sections.length - 1].folders.push({
    ...folder,
    pages: [],
  });
  sections = insertPage(sections, page, answers);
  return sections;
};

const insertPage = (sections, page, answers) => {
  sections[sections.length - 1].folders[
    sections[sections.length - 1].folders.length - 1
  ].pages.push({
    ...page,
    answers,
  });
  return sections;
};

const getCalculatedSummaryPages = (questionnaire, pageId, sectionId) => {
  const sections = [];
  if (questionnaire?.sections) {
    for (const section of questionnaire?.sections) {
      if (section.id === sectionId) {
        return sections;
      }
      for (const folder of section?.folders) {
        for (const page of folder?.pages) {
          const answers = page?.answers;
          if (page?.pageType === "CalculatedSummaryPage") {
            if (page.id === pageId) {
              return sections;
            }
            if (sections[sections.length - 1]?.id === section?.id) {
              if (
                sections[sections.length - 1].folders[
                  sections[sections.length - 1].folders.length - 1
                ]?.id === folder?.id
              ) {
                insertPage(sections, page, answers);
              } else {
                insertFolder(sections, folder, page, answers);
              }
            } else {
              insertSection(sections, section, folder, page, answers);
            }
          }
        }
      }
    }
  }
  return sections;
};

export default getCalculatedSummaryPages;
