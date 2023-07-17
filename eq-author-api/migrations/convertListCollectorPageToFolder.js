const { v4: uuidv4 } = require("uuid");
const {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
} = require("../src/businessLogic/createListCollectorPages");

module.exports = (questionnaire) => {
  let convertedListCollectorFolder;

  questionnaire.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      folder.pages.forEach((page) => {
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

          // Adds list collector folder after the folder the list collector page was contained in
          const newFolderPosition = folderIndex + 1;
          section.folders.splice(
            newFolderPosition,
            0,
            convertedListCollectorFolder
          );

          // Finds list collector page in its folder and deletes it from its folder
          const pageIndex = folder.pages.indexOf(page);
          folder.pages.splice(pageIndex, 1);
        }
      });
    });
  });

  return questionnaire;
};
