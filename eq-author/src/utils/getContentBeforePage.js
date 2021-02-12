// contentBeforePage:
// Given questionnaire and pageId, return section, folder, page tree
//   up to but not including target page

const filterPages = (pages, pageId) => {
  const results = [];

  for (const page of pages) {
    if (page.id === pageId) {
      return [results, true];
    }
    results.push(page);
  }

  return [results, false];
};

const getContentBeforePage = ({ questionnaire, pageId }) => {
  const contentBeforePage = [];

  for (const section of questionnaire.sections) {
    const sectionContentBeforePage = {
      ...section,
      folders: [],
    };
    contentBeforePage.push(sectionContentBeforePage);

    for (const folder of section.folders) {
      const [pages, folderContainsPage] = filterPages(folder.pages, pageId);

      if (pages.length) {
        sectionContentBeforePage.folders.push({
          ...folder,
          pages,
        });
      }

      if (folderContainsPage) {
        return contentBeforePage;
      }
    }
  }
};

export default ({ questionnaire, pageId }) => {
  const contentBeforePage = getContentBeforePage({ questionnaire, pageId });

  return contentBeforePage?.[0]?.folders?.length ? contentBeforePage : [];
};
