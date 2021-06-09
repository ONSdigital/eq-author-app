import {
  getPageById,
  getFolderById,
  getSectionById,
  getSectionByFolderId,
} from "utils/questionnaireUtils";

// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
const array_move = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

// https://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
// Adapted to immediately drill down to find the first page in a folder
const findFolderIndexByFirstPageAttr = (array, attr, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].pages[0][attr] === value) {
      return i;
    }
  }
  return -1;
};

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
            pages: pages.map(({ id, position: oldPosition }) => ({
              id,
              position: oldPosition,
              __typename: "QuestionPage",
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
        enabled && array_move(pages, pageBeingMoved.position, newPosition)
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
            pages: pages.map((page) => ({
              ...page,
              __typename: "QuestionPage",
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
    const pageFolderIndex = findFolderIndexByFirstPageAttr(
      optimisticResponse.movePage.section.folders,
      "id",
      pageId
    );

    // Fix optimistic response - Move the folder into the correct position.
    array_move(
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
