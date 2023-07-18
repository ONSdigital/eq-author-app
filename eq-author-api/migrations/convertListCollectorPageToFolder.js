const { v4: uuidv4 } = require("uuid");
const createFolder = require("../src/businessLogic/createFolder");
const {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
} = require("../src/businessLogic/createListCollectorPages");

module.exports = (questionnaire) => {
  let convertedListCollectorFolder;
  let folderPositionIterator = 1;

  questionnaire.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      // Uses for instead of forEach to prevent list collector pages being skipped when there are multiple list collector pages in folder
      for (let pageIndex = 0; pageIndex < folder.pages.length; pageIndex++) {
        const page = folder.pages[pageIndex];
        if (page.pageType === "ListCollectorPage") {
          // Creates list collector folder from list collector page data
          convertedListCollectorFolder = {
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

          // Gets the index of the folder containing the list collector page
          const folderIndex = section.folders.indexOf(folder);

          // Incremements iterator to handle folders containing multiple list collector pages
          folderPositionIterator++;
          // Adds list collector folder after the folder the list collector page was contained in, or after the last list collector folder created in the migration
          const newFolderPosition = folderIndex + folderPositionIterator;
          section.folders.splice(
            newFolderPosition,
            0,
            convertedListCollectorFolder
          );

          // Deletes page at position i then decreases the iterator - prevents pages being skipped in the loop
          folder.pages.splice(pageIndex--, 1);
        } else {
          let folderIndex = section.folders.indexOf(folder);

          folderPositionIterator++;

          const newFolderPosition = folderIndex + folderPositionIterator;
          const newFolder = createFolder({ pages: [page] });
          section.folders.splice(newFolderPosition, 0, newFolder);

          folder.pages.splice(pageIndex--, 1);

          if (folder.pages.length === 0) {
            section.folders.splice(folderIndex, 1);
          }
        }
      }
    });
  });

  return questionnaire;
};
