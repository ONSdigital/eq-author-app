import {
  getPageById,
  getFolderById,
  getSectionByFolderId,
  getSectionByPageId,
  getFolderByPageId,
  getSectionById,
} from "utils/questionnaireUtils";

export default (
  questionnaire,
  sourceId,
  sourceContext,
  sourcePosition,
  targetId,
  targetContext,
  targetPosition,
  placement,
  movePage,
  moveFolder,
  moveSection
) => {
  // The user dropped the item outside a destination
  if (!targetId) {
    return -1;
  }

  // The user dropped the item back where it started
  if (targetId === sourceId) {
    return -1;
  }

  // Disallowed moves
  if (sourceContext === "Folder" && targetContext === "FolderPage") {
    return -1;
  }
  if (sourceContext === "Section" && targetContext !== "Section") {
    return -1;
  }

  let sourceElement, sourceContainer, sourceContainerId, targetContainerId;
  let targetContainer, targetSectionId, targetFolderId;
  let position;

  // Get the source elements and containers
  switch (sourceContext) {
    case "SectionPage":
      sourceElement =
        targetContext === "FolderPage"
          ? getPageById(questionnaire, sourceId)
          : getFolderByPageId(questionnaire, sourceId);
      ({ folders: sourceContainer, id: sourceContainerId } = getSectionByPageId(
        questionnaire,
        sourceId
      ));
      break;
    case "FolderPage":
      sourceElement = getPageById(questionnaire, sourceId);
      ({ pages: sourceContainer, id: sourceContainerId } = getFolderByPageId(
        questionnaire,
        sourceId
      ));
      break;
    case "Folder":
      sourceElement = getFolderById(questionnaire, sourceId);
      ({ folders: sourceContainer, id: sourceContainerId } =
        getSectionByFolderId(questionnaire, sourceId));
      break;
    case "Section":
      sourceElement = getSectionById(questionnaire, sourceId);
      ({ sections: sourceContainer, id: sourceContainerId } = questionnaire);
      break;
    default:
      return -1;
  }

  // Get the target containers
  switch (targetContext) {
    case "SectionPage":
      ({ folders: targetContainer, id: targetContainerId } = getSectionByPageId(
        questionnaire,
        targetId
      ));
      targetSectionId = targetContainerId;
      break;
    case "FolderPage":
      ({ pages: targetContainer, id: targetContainerId } = getFolderByPageId(
        questionnaire,
        targetId
      ));
      targetFolderId = targetContainerId;
      break;
    case "Folder":
      ({ folders: targetContainer, id: targetContainerId } =
        getSectionByFolderId(questionnaire, targetId));
      targetFolderId = targetContainerId;
      break;
    case "Section":
      sourceContext === "Section"
        ? ({ sections: targetContainer, id: targetContainerId } = questionnaire)
        : ({ folders: targetContainer, id: targetContainerId } = getSectionById(
            questionnaire,
            targetId
          ));
      targetSectionId = targetContainerId;
      break;
    default:
      return -1;
  }

  // set position
  position = placement === "above" ? targetPosition : targetPosition + 1;
  if (sourceContainerId === targetContainerId) {
    position = sourcePosition < targetPosition ? position - 1 : position;
  }

  if (sourceContext !== "Section" && targetContext === "Section") {
    position = 0;
  }

  // remove element from source container
  sourceContainer.splice(sourceContainer.indexOf(sourceElement), 1);

  // add element to target container
  let newElement = sourceElement;
  if (
    sourceContext === "FolderPage" &&
    (targetContext.includes("Section") || targetContext === "Folder")
  ) {
    newElement = {
      id: 123,
      pages: [sourceElement],
      alias: null,
      displayName: "Untitled folder",
      enabled: false,
      position,
      validationErrorInfo: {
        id: 678,
        totalCount: 0,
        __typename: "ValidationErrorInfo",
      },
      __typename: "Folder",
    };
  }
  targetContainer.splice(position, 0, newElement);

  // move a page
  if (sourceContext.includes("Page")) {
    movePage({
      variables: {
        input: {
          id: sourceId,
          sectionId: targetSectionId,
          folderId: targetFolderId,
          position,
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

  //move a folder
  if (sourceContext === "Folder") {
    moveFolder({
      variables: {
        input: {
          id: sourceId,
          sectionId: targetSectionId,
          position,
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

  // move a section
  if (sourceContext === "Section") {
    moveSection({
      variables: {
        input: {
          questionnaireId: questionnaire.id,
          id: sourceId,
          position,
        },
      },
      optimisticResponse: {
        moveSection: {
          ...questionnaire,
        },
      },
    });
    return 1;
  }

  return -1;
};
