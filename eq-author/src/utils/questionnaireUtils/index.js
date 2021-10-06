export const getSections = (questionnaire) => questionnaire?.sections;

export const getFolders = (questionnaire) =>
  getSections(questionnaire)?.flatMap(({ folders }) => folders);

export const getPages = (questionnaire) =>
  getFolders(questionnaire)?.flatMap(({ pages }) => pages);

export const getAnswers = (questionnaire) =>
  getPages(questionnaire)?.flatMap(({ answers }) => answers);

export const getFolderById = (questionnaire, folderId) =>
  getFolders(questionnaire)?.find(({ id }) => id === folderId);

export const getFolderByPageId = (questionnaire, id) =>
  getFolders(questionnaire)?.find(({ pages }) =>
    pages.some((page) => page.id === id)
  );

export const getSectionById = (questionnaire, sectionId) =>
  getSections(questionnaire)?.find(({ id }) => id === sectionId);

export const getSectionByFolderId = (questionnaire, id) =>
  getSections(questionnaire)?.find(({ folders }) =>
    folders.some((folder) => folder.id === id)
  );

export const getSectionByPageId = (questionnaire, id) =>
  getSections(questionnaire)?.find(({ folders }) =>
    folders.some((folder) => folder.pages.some((page) => page.id === id))
  );
export const getPageById = (questionnaire, id) =>
  getPages(questionnaire)?.find((page) => page.id === id);

export const getPageByConfirmationId = (questionnaire, id) =>
  getPages(questionnaire)?.find(({ confirmation }) => confirmation.id === id);

export const findFolderIndexByPageAttr = (folders, attr, value) => {
  const folder = folders.find((folder) =>
    folder.pages.some((page) => page[attr] === value)
  );

  return folders.indexOf(folder);
};

export const removePageById = (questionnaire, id) =>
  getPages(questionnaire).filter((page) => page.id !== id);
