import {
  getPageById,
  getFolderById,
  getSectionById,
  getSectionByFolderId,
} from "utils/questionnaireUtils";

export const onDragEnd = (
  questionnaire,
  destination,
  source,
  draggableId,
  movePage,
  moveFolder
) => {
  // The user dropped the item outside a destination
  if (!destination) {
    return;
  }

  // The user dropped the item back where it started
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
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
    return;
  }

  //If the user is moving a page into a folder
  if (pageBeingMoved && destinationFolder) {
    const { id } = pageBeingMoved;
    const { id: folderId } = destinationFolder;

    const { id: sectionId } = getSectionByFolderId(questionnaire, folderId);
    const { index: position } = destination;

    movePage({
      variables: {
        input: {
          id,
          sectionId,
          folderId,
          position,
        },
      },
    });
  }

  // If the user is moving a page into a section
  if (pageBeingMoved && destinationSection) {
    const { id } = pageBeingMoved;
    const { id: sectionId } = destinationSection;
    const { index: position } = destination;

    movePage({
      variables: {
        input: {
          id,
          sectionId,
          position,
        },
      },
    });
  }

  // If the user is moving a folder into a section
  if (folderBeingMoved && destinationSection) {
    const { id } = folderBeingMoved;
    const { id: sectionId } = destinationSection;
    const { index: position } = destination;

    moveFolder({
      variables: {
        input: {
          id,
          sectionId,
          position,
        },
      },
    });
  }
};
