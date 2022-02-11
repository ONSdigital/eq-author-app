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
  moveFolder,
  moveSection
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
    const { id: sectionId } = getSectionByFolderId(
      questionnaire,
      destinationFolder.id
    );
    const newPosition = destination.index;

    const sourceFolder = getFolderByPageId(questionnaire, pageBeingMoved.id);
    sourceFolder.pages.splice(sourceFolder.pages.indexOf(pageBeingMoved), 1);
    destinationFolder.pages.splice(newPosition, 0, pageBeingMoved);

    movePage({
      variables: {
        input: {
          id: pageBeingMoved.id,
          sectionId,
          folderId: destinationFolder.id,
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
    const newPosition = destination.index;
    const sourceFolder = getFolderByPageId(questionnaire, pageBeingMoved.id);
    sourceFolder.pages.splice(sourceFolder.pages.indexOf(pageBeingMoved), 1);
    if (!sourceFolder.enabled && !sourceFolder.pages.length) {
      const sourceSection = getSectionByFolderId(
        questionnaire,
        sourceFolder.id
      );
      sourceSection.folders.splice(
        sourceSection.folders.indexOf(sourceFolder),
        1
      );
    }

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

    destinationSection.folders.splice(newPosition, 0, newFolder);

    movePage({
      variables: {
        input: {
          id: pageBeingMoved.id,
          sectionId: destinationSection.id,
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
    const newPosition = destination.index;
    const sourceSection = getSectionByFolderId(
      questionnaire,
      folderBeingMoved.id
    );
    sourceSection.folders.splice(
      sourceSection.folders.indexOf(folderBeingMoved),
      1
    );
    destinationSection.folders.splice(newPosition, 0, folderBeingMoved);

    moveFolder({
      variables: {
        input: {
          id: folderBeingMoved.id,
          sectionId: destinationSection.id,
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

  if (
    destination.droppableId === "root" &&
    source.droppableId === "root" &&
    destination.index !== source.index
  ) {
    const sectionToMove = questionnaire.sections.splice(source.index, 1);
    questionnaire.sections.splice(destination.index, 0, sectionToMove[0]);
    moveSection({
      variables: {
        input: {
          id: draggableId,
          position: destination.index,
        },
      },
      optimisticResponse: {
        moveSection: {
          ...questionnaire,
        },
      },
    });
  }

  return -1;
};
