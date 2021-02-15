// contentBeforePage:
// Given questionnaire and pageId, return section, folder, page tree
//   up to but not including target page

const filterPages = (pages, pageId, preprocess) => {
  const results = [];

  for (const page of pages) {
    if (page.id === pageId) {
      return [results, true];
    }

    results.push(
      preprocess({
        ...page,
        answers: page.answers.flatMap(preprocess),
      })
    );
  }

  return [results, false];
};

const identity = (entity) => entity;

const getContentBeforePage = ({ questionnaire, pageId, preprocess }) => {
  const contentBeforePage = [];

  for (const section of questionnaire.sections) {
    const sectionContentBeforePage = {
      ...preprocess(section),
      folders: [],
    };

    contentBeforePage.push(sectionContentBeforePage);

    for (const folder of section.folders) {
      const [pages, folderContainsPage] = filterPages(
        folder.pages,
        pageId,
        preprocess
      );

      if (pages.length) {
        sectionContentBeforePage.folders.push({
          ...preprocess(folder),
          pages,
        });
      }

      if (folderContainsPage) {
        return contentBeforePage;
      }
    }
  }
};

export default ({ questionnaire, pageId, preprocess = identity }) => {
  const contentBeforePage = getContentBeforePage({
    questionnaire,
    pageId,
    preprocess,
  });

  return contentBeforePage?.[0]?.folders?.length ? contentBeforePage : [];
};
