export const getSections = (questionnaire) => questionnaire?.sections;

export const getFolders = (questionnaire) =>
  getSections(questionnaire)?.flatMap(({ folders }) => folders);

export const getPages = (questionnaire) =>
  getFolders(questionnaire)?.flatMap(({ pages }) => pages);

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

// https://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
// Adapted to immediately drill down to find the first page in a folder
export const findFolderIndexByFirstPageAttr = (array, attr, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].pages[0][attr] === value) {
      return i;
    }
  }
  return -1;
};
