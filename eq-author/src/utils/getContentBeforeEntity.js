const filterPages = (pages, pageId, confirmationId, preprocess) => {
  const results = [];

  for (const page of pages) {
    if (page.id === pageId) {
      return [results, true];
    }

    results.push(
      preprocess({
        ...page,
        answers: page?.answers?.flatMap(preprocess),
      })
    );

    if (page.confirmation?.id === confirmationId) {
      return [results, true];
    }
  }

  return [results, false];
};

const identity = (entity) => entity;

const getContentBeforeEntity = ({
  questionnaire,
  pageId,
  confirmationId,
  folderId,
  sectionId,
  preprocess,
}) => {
  const contentBeforeEntity = [];

  for (const section of questionnaire.sections) {
    if (section.id === sectionId) {
      return contentBeforeEntity;
    }

    const sectionContentBeforeEntity = {
      ...preprocess(section),
      folders: [],
    };

    contentBeforeEntity.push(sectionContentBeforeEntity);

    for (const folder of section.folders) {
      if (folder.id === folderId) {
        return contentBeforeEntity;
      }

      const [pages, folderContainsPage] = filterPages(
        folder.pages,
        pageId,
        confirmationId,
        preprocess
      );

      if (pages.length) {
        sectionContentBeforeEntity.folders.push({
          ...preprocess(folder),
          pages,
        });
      }

      if (folderContainsPage) {
        return contentBeforeEntity;
      }
    }
  }
};

export default ({
  questionnaire,
  pageId = null,
  confirmationId = null,
  sectionId = null,
  folderId = null,
  preprocess = identity,
}) => {
  const contentBeforeEntity = getContentBeforeEntity({
    questionnaire,
    pageId,
    confirmationId,
    folderId,
    sectionId,
    preprocess,
  });

  return contentBeforeEntity.filter(({ folders }) => folders.length);
};
