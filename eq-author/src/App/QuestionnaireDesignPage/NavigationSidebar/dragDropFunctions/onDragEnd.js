import {
  getPageById,
  getFolderById,
  getSectionById,
  getSectionByFolderId,
  getFolderByPageId,
} from "utils/questionnaireUtils";

export default (
  questionnaire,
  destination,
  source,
  draggableId,
  movePage,
  moveFolder
) => {
  // The user dropped the item outside a destination
  if (!destination) {
    return -1;
  }

  // The user dropped the item back where it started
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return -1;
  }

  const pageBeingMoved = getPageById(questionnaire, draggableId);
  const folderBeingMoved = getFolderById(questionnaire, draggableId);

  const destinationSection = getSectionById(
    questionnaire,
    destination.droppableId
  );

  const destinationFolder = getFolderById(
    questionnaire,
    destination.droppableId
  );

  // If the user is moving a folder into a folder
  if (folderBeingMoved && destinationFolder) {
    return -1;
  }

  //If the user is moving a page into a folder
  if (pageBeingMoved && destinationFolder) {
    const { id: pageId } = pageBeingMoved;
    const { id: folderId } = destinationFolder;
    const { id: sectionId } = getSectionByFolderId(questionnaire, folderId);
    const { index: newPosition } = destination;

    const oldFolder = getFolderByPageId(questionnaire, pageId);
    const oldPages = oldFolder.pages;
    oldPages.splice(oldPages.indexOf(pageBeingMoved), 1);
    destinationFolder.pages.splice(newPosition, 0, pageBeingMoved);

    movePage({
      variables: {
        input: {
          id: pageId,
          sectionId,
          folderId,
          position: newPosition,
        },
      },
      optimisticResponse: {
        movePage: {
          ...questionnaire,
        },
      },
    });

    return 1;
  }

  // If the user is moving a page into a section
  if (pageBeingMoved && destinationSection) {
    const { id: pageId } = pageBeingMoved;
    const { id: sectionId } = destinationSection;
    const { index: newPosition } = destination;

    const oldFolder = getFolderByPageId(questionnaire, pageId);
    const oldPages = oldFolder.pages;
    oldPages.splice(oldPages.indexOf(pageBeingMoved), 1);

    const { folders } = destinationSection;
    const newFolder = {
      id: 123,
      pages: [pageBeingMoved],
      alias: null,
      displayName: "Untitled folder",
      enabled: false,
      position: newPosition,
      validationErrorInfo: {
        id: 678,
        totalCount: 0,
        __typename: "ValidationErrorInfo",
      },
      __typename: "Folder",
    };
    folders.splice(newPosition, 0, newFolder);

    movePage({
      variables: {
        input: {
          id: pageId,
          sectionId,
          position: newPosition,
        },
      },
      optimisticResponse: {
        movePage: {
          ...questionnaire,
        },
      },
    });

    return 1;
  }

  // If the user is moving a folder into a section
  if (folderBeingMoved && destinationSection) {
    const { id: folderId } = folderBeingMoved;
    const { id: sectionId } = destinationSection;
    const { index: newPosition } = destination;

    const oldSection = getSectionByFolderId(questionnaire, folderId);
    oldSection.folders.splice(oldSection.folders.indexOf(folderBeingMoved), 1);
    destinationSection.folders.splice(newPosition, 0, folderBeingMoved);

    moveFolder({
      variables: {
        input: {
          id: folderId,
          sectionId,
          position: newPosition,
        },
      },
      optimisticResponse: {
        moveFolder: {
          ...questionnaire,
        },
      },
    });

    return 1;
  }

  return -1;
};
