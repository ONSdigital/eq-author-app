import {
  getPageById,
  getFolderById,
  getSectionById,
  getSectionByFolderId,
  findFolderIndexByPageAttr,
} from "utils/questionnaireUtils";

import arrayMove from "utils/arrayMove";

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
  if (
    pageBeingMoved && // Moving a page
    destinationFolder && // Into a folder
    source.droppableId === destination.droppableId // And we're moving within the same folder
  ) {
    const { id: pageId, title } = pageBeingMoved;
    const { id: folderId } = destinationFolder;
    const { id: sectionId, folders } = getSectionByFolderId(
      questionnaire,
      folderId
    );
    const { index: newPosition } = destination;

    // Template an optimistic response as best we can
    const optimisticResponse = {
      movePage: {
        position: newPosition,
        id: pageId,
        title,
        section: {
          id: sectionId,
          folders: folders.map(({ pages, validationErrorInfo, ...rest }) => ({
            ...rest,
            pages: pages.map(({ pageType, id, position }) => ({
              id,
              position,
              __typename:
                pageType === "CalculatedSummaryPage"
                  ? "CalculatedSummaryPage"
                  : "QuestionPage",
            })),
            validationErrorInfo: {
              errors: [],
              ...validationErrorInfo,
              __typename: "ValidationErrorInfo",
            },
            __typename: "Folder",
          })),
          __typename: "Section",
        },
        __typename: "QuestionPage",
      },
    };

    // Fix optimistic response - move the page into the new position
    optimisticResponse.movePage.section.folders.forEach(
      ({ enabled, pages }) =>
        enabled && arrayMove(pages, pageBeingMoved.position, newPosition)
    );

    // Fix optimistic response - Fix position props in pages
    optimisticResponse.movePage.section.folders.forEach(
      ({ enabled, pages }) =>
        enabled && pages.forEach((page, index) => (page.position = index))
    );

    // Call the DB to move the page, passing in our optimistic response to avoid
    // flickering if it takes time to respond
    movePage({
      variables: {
        input: {
          id: pageId,
          sectionId,
          folderId,
          position: newPosition,
        },
      },
      optimisticResponse,
    });

    return 1;
  }

  if (
    pageBeingMoved && // Moving a page
    destinationFolder && // Into a folder
    source.droppableId !== destination.droppableId // Moving into a different folder
  ) {
    const { id: pageId } = pageBeingMoved;
    const {
      id: destinationFolderId,
      validationErrorInfo,
      pages,
    } = destinationFolder;

    // Data
    const section = getSectionByFolderId(questionnaire, destinationFolderId);
    const { id: sectionId, folders } = section;
    const { index: newPosition } = destination;

    // Start to template the optimistic response as best we can
    const optimisticResponse = {
      movePage: {
        ...pageBeingMoved,
        position: newPosition,
        folder: {
          ...destinationFolder,
          pages: [...pages, pageBeingMoved],
          validationErrorInfo: { errors: [], ...validationErrorInfo },
        },
        section: {
          ...section,
          folders: folders.map((folder) => ({
            ...folder,
            pages:
              folder.id === destinationFolderId
                ? [...folder.pages, pageBeingMoved]
                : [...folder.pages],
          })),
        },
      },
    };

    // Fix the optimistic response -- move the pages into the right position

    /* For the folder section of the JSON */
    const orderedPageIds_Folder = optimisticResponse.movePage.folder.pages.map(
      (page) => page.id
    );
    const oldPosition = orderedPageIds_Folder.indexOf(pageBeingMoved.id);

    arrayMove(
      optimisticResponse.movePage.folder.pages,
      oldPosition,
      newPosition
    );

    /* For the section section of the JSON */
    optimisticResponse.movePage.section.folders.forEach((folder) => {
      switch (folder.id) {
        case source.droppableId: {
          // TODO - remove the page we are moving from this folder
        }

        case destinationFolderId: {
          // TODO - move the page we are moving into this folder
        }

        default: {
        }
      }
    });

    // Fix the optimistic response -- replace the positions
    /* For the folder section of the JSON */
    optimisticResponse.movePage.folder.pages.forEach(
      (page, i) => (page.position = i)
    );

    movePage({
      variables: {
        input: {
          id: pageId,
          sectionId,
          folderId: destinationFolderId,
          position: newPosition,
        },
      },
    });
  }

  // If the user is moving a page into a section
  if (pageBeingMoved && destinationSection) {
    const { id: pageId, title: pageTitle } = pageBeingMoved;
    const { id: sectionId, folders } = destinationSection;
    const { index: newPosition } = destination;

    // Template an optimistic response as best we can.
    const optimisticResponse = {
      movePage: {
        id: pageId,
        title: pageTitle,
        position: newPosition,
        section: {
          id: sectionId,
          folders: folders.map(({ pages, ...rest }) => ({
            ...rest,
            pages: pages.map(({ pageType, id, position }) => ({
              id,
              position,
              __typename:
                pageType === "CalculatedSummaryPage"
                  ? "CalculatedSummaryPage"
                  : "QuestionPage",
            })),
            __typename: "Folder",
          })),
          __typename: "Section",
        },
        __typename: "QuestionPage",
      },
    };

    // Fix optimistic response - Find the index of the page's parent
    // folder, as we can move the entire folder since it will be
    // disabled and only contain the page we want to move.
    const pageFolderIndex = findFolderIndexByPageAttr(
      optimisticResponse.movePage.section.folders,
      "id",
      pageId
    );

    // Fix optimistic response - Move the folder into the correct position.
    arrayMove(
      optimisticResponse.movePage.section.folders,
      pageFolderIndex,
      newPosition
    );

    // Fix optimistic response - Fix the folders position attribute.
    optimisticResponse.movePage.section.folders.forEach(
      (folder, index) => (folder.position = index)
    );

    // Call the DB to move the page, passing in our optimistic response to
    // avoid flickering if it takes time to respond.
    movePage({
      variables: {
        input: {
          id: pageId,
          sectionId,
          position: newPosition,
        },
      },
      optimisticResponse,
    });

    return 1;
  }

  // If the user is moving a folder into a section
  if (folderBeingMoved && destinationSection) {
    const { id: folderId, ...rest } = folderBeingMoved;
    const { id: sectionId, folders } = destinationSection;
    const { index: newPosition } = destination;

    // Template an optimistic response as best we can.
    const optimisticResponse = {
      moveFolder: {
        ...rest,
        id: folderId,
        section: {
          id: sectionId,
          folders: folders.map(({ pages, ...rest }) => ({
            ...rest,
            pages: pages.map(({ pageType, id, position }) => ({
              id,
              position,
              __typename:
                pageType === "CalculatedSummaryPage"
                  ? "CalculatedSummaryPage"
                  : "QuestionPage",
            })),
            __typename: "Folder",
          })),
          __typename: "Section",
        },
      },
    };

    // Fix optimistic response - find the old position of the folder.
    const oldPosition = folderBeingMoved.position;

    // Fix optimistic response - move the folder.
    arrayMove(
      optimisticResponse.moveFolder.section.folders,
      oldPosition,
      newPosition
    );

    // Fix optimistic response - Fix the folders position attribute.
    optimisticResponse.moveFolder.section.folders.forEach(
      (folder, index) => (folder.position = index)
    );

    // Call the DB to move the page, passing in our optimistic response to
    // avoid flickering if it takes time to respond.
    moveFolder({
      variables: {
        input: {
          id: folderId,
          sectionId,
          position: newPosition,
        },
      },
      optimisticResponse,
    });

    return 1;
  }

  return -1;
};
