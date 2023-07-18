const { v4: uuidv4 } = require("uuid");
const createFolder = require("../src/businessLogic/createFolder");

const {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
} = require("../src/businessLogic/createListCollectorPages");

const hasListCollectorPage = (folder) =>
  folder.pages.some((page) => page.pageType === "ListCollectorPage");

const generateListCollectorFolder = (page) => {
  const generatedListCollectorFolder = {
    id: page.id,
    alias: page.alias,
    title: page.title,
    listId: page.listId,
    pages: [
      createListCollectorQualifierPage({
        title: page.drivingQuestion,
        pageDescription: page.pageDescription,
        additionalGuidanceEnabled: page.additionalGuidancePanelSwitch,
        additionalGuidanceContent: page.additionalGuidancePanel,
        position: 0,
        answers: [
          {
            type: "Radio",
            qCode: page.drivingQCode,
            options: [
              {
                id: uuidv4(),
                label: page.drivingPositive,
                description: page.drivingPositiveDescription,
              },
              {
                id: uuidv4(),
                label: page.drivingNegative,
                description: page.drivingNegativeDescription,
              },
            ],
          },
        ],
      }),
      createListCollectorAddItemPage({
        title: page.addItemTitle,
        pageDescription: page.addItemPageDescription,
        position: 1,
      }),
      createListCollectorConfirmationPage({
        title: page.anotherTitle,
        pageDescription: page.anotherPageDescription,
        position: 2,
        answers: [
          {
            type: "Radio",
            qCode: page.anotherQCode,
            options: [
              {
                id: uuidv4(),
                label: page.anotherPositive,
                description: page.anotherPositiveDescription,
              },
              {
                id: uuidv4(),
                label: page.anotherNegative,
                description: page.anotherNegativeDescription,
              },
            ],
          },
        ],
      }),
    ],
  };

  return generatedListCollectorFolder;
};

module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      // Check folder has list collector page
      const folderContainsListCollectorPage = hasListCollectorPage(folder);
      const folderIndex = section.folders.indexOf(folder);

      // If folder has list collector question, duplicate folder with a slice of questions
      if (folderContainsListCollectorPage) {
        const listCollectorPage = folder.pages.find(
          (page) => page.pageType === "ListCollectorPage"
        );

        const listCollectorPageIndex = folder.pages.indexOf(listCollectorPage);

        const pagesBeforeListCollectorPage = folder.pages.slice(
          0,
          listCollectorPageIndex
        );
        const pagesAfterListCollectorPage = folder.pages.slice(
          listCollectorPageIndex + 1
        );

        // Create basic folder of pages before list collector page
        const folderWithPagesBeforeListCollector = createFolder({
          pages: pagesBeforeListCollectorPage,
        });

        // Create a new folder of pages after list collector page
        const folderWithPagesAfterListCollector = createFolder({
          pages: pagesAfterListCollectorPage,
        });

        // Create list collector folder containing list collector page's data
        const newListCollectorFolder =
          generateListCollectorFolder(listCollectorPage);

        // Adds each of the created folders to their expected positions in the section
        section.folders.splice(
          folderIndex + 1,
          0,
          folderWithPagesBeforeListCollector
        );
        section.folders.splice(folderIndex + 2, 0, newListCollectorFolder);
        section.folders.splice(
          folderIndex + 3,
          0,
          folderWithPagesAfterListCollector
        );

        section.folders.splice(folderIndex, 1);
      }
    });
  });

  return questionnaire;
};
