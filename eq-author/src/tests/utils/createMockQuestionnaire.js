import { times } from "lodash";

const DEFAULT_ANSWER_COUNT = 0;
const DEFAULT_PAGE_COUNT = 1;
const DEFAULT_FOLDER_COUNT = 1;
const DEFAULT_SECTION_COUNT = 1;

export const buildAnswers = ({
  sectionNumber = 1,
  folderNumber = 1,
  pageNumber = 1,
  answerCount = DEFAULT_ANSWER_COUNT,
} = {}) =>
  times(answerCount, (i) => {
    const id = `${sectionNumber}.${folderNumber}.${pageNumber}.${i + 1}`;

    return {
      id,
      displayName: `Answer ${id}`,
      type: "Number",
    };
  });

export const buildPages = ({
  sectionNumber = 1,
  folderNumber = 1,
  answerCount = DEFAULT_ANSWER_COUNT,
  pageCount = DEFAULT_PAGE_COUNT,
} = {}) =>
  times(pageCount, (i) => {
    const id = `${sectionNumber}.${folderNumber}.${i + 1}`;

    return {
      id,
      title: `Page ${id}`,
      displayName: `Page ${id}`,
      description: "",
      descriptionEnabled: false,
      guidance: "",
      guidanceEnabled: false,
      definitionLabel: "",
      definitionContent: "",
      definitionEnabled: false,
      additionalInfoLabel: "",
      additionalInfoContent: "",
      additionalInfoEnabled: false,
      alias: id,
      position: i,
      pageType: "QuestionPage", // this is needed to build collapsible nav items
      validationErrorInfo: {
        totalCount: 2,
        errors: [],
      },
      section: {
        id: `${sectionNumber}`,
        displayName: "",
        position: 0,
        questionnaire: {
          metadata: [],
        },
      },
      folder: {
        id: `${folderNumber}`,
        position: 0,
      },
      answers: buildAnswers({
        sectionNumber,
        folderNumber,
        pageNumber: i + 1,
        answerCount,
      }),
    };
  });

export const buildFolders = ({
  sectionNumber = 1,
  folderCount = DEFAULT_FOLDER_COUNT,
  pageCount = DEFAULT_PAGE_COUNT,
  answerCount = DEFAULT_ANSWER_COUNT,
} = {}) =>
  times(folderCount, (i) => {
    const id = `${sectionNumber}.${i + 1}`;
    return {
      id,
      alias: `Folder ${id}`,
      displayName: `Folder ${id}`,
      enabled: i > 0,
      position: i,
      pages: buildPages({
        sectionNumber,
        folderNumber: i + 1,
        pageCount,
        answerCount,
      }),
      section: { id: `${i + 1}` },
      validationErrorInfo: {
        id: `${id}-validationErrorInfo`,
        errors: [],
        totalCount: 0,
        __typename: "ValidationErrorInfo",
      },
    };
  });

export const buildSections = ({
  sectionCount = DEFAULT_SECTION_COUNT,
  folderCount = DEFAULT_FOLDER_COUNT,
  pageCount = DEFAULT_PAGE_COUNT,
  answerCount = DEFAULT_ANSWER_COUNT,
} = {}) =>
  times(sectionCount, (i) => ({
    id: `${i + 1}`,
    title: `Section ${i + 1}`,
    displayName: `Section ${i + 1}`,
    folders: buildFolders({
      sectionNumber: i + 1,
      folderCount,
      pageCount,
      answerCount,
    }),
    position: i,
    validationErrorInfo: {
      totalCount: 0,
    },
  }));

export const buildQuestionnaire = (options) => ({
  id: "questionnaire",
  title: "questionnaire",
  displayName: "questionnaire",
  sections: buildSections(options),
});
