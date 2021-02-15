import { times } from "lodash";

const DEFAULT_PAGE_COUNT = 1;
const DEFAULT_FOLDER_COUNT = 1;
const DEFAULT_SECTION_COUNT = 1;

export const buildPages = ({
  sectionNumber = 1,
  folderNumber = 1,
  pageCount = DEFAULT_PAGE_COUNT,
} = {}) =>
  times(pageCount, i => {
    const id = `${sectionNumber}.${folderNumber}.${i + 1}`;

    return {
      id,
      title: `Page ${id}`,
      displayName: `Page ${id}`,
      alias: id,
      position: i,
      validationErrorInfo: {
        totalCount: 2,
      },
      section: {
        id: `${sectionNumber}`,
      },
      folder: {
        id: `${folderNumber}`,
      },
    };
  });

export const buildFolders = ({
  sectionNumber = 1,
  folderCount = DEFAULT_FOLDER_COUNT,
  pageCount = DEFAULT_PAGE_COUNT,
} = {}) =>
  times(folderCount, i => {
    const id = `${sectionNumber}.${i + 1}`;

    return {
      id,
      alias: `Folder ${id}`,
      enabled: false,
      position: i,
      pages: buildPages({
        sectionNumber,
        folderNumber: i + 1,
        pageCount,
      }),
    };
  });

export const buildSections = ({
  sectionCount = DEFAULT_SECTION_COUNT,
  folderCount = DEFAULT_FOLDER_COUNT,
  pageCount = DEFAULT_PAGE_COUNT,
} = {}) =>
  times(sectionCount, i => ({
    id: `${i + 1}`,
    title: `Section ${i + 1}`,
    displayName: `Section ${i + 1}`,
    folders: buildFolders({
      sectionNumber: i + 1,
      folderCount,
      pageCount,
    }),
    position: i,
    validationErrorInfo: {
      totalCount: 0,
    },
  }));

export const buildQuestionnaire = options => ({
  id: "questionnaire",
  title: "questionnaire",
  displayName: "questionnaire",
  sections: buildSections(options),
});
