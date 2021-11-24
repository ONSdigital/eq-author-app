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
  targetId,
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

  // Get the source elements and containers
  const sourceElement =
    getPageById(questionnaire, sourceId) ||
    getFolderById(questionnaire, sourceId) ||
    getSectionById(questionnaire, sourceId);
  let sourcePosition = sourceElement.position;

  let sourceContainer =
    getFolderByPageId(questionnaire, sourceElement.id) ||
    getSectionByFolderId(questionnaire, sourceElement.id) ||
    getSectionById(questionnaire, sourceElement.id);

  if (sourceContainer?.__typename === "Folder" && !sourceContainer?.enabled) {
    sourcePosition = sourceContainer.position;
    sourceContainer = getSectionByFolderId(questionnaire, sourceContainer.id);
  }

  const targetElement =
    getPageById(questionnaire, targetId) ||
    getFolderById(questionnaire, targetId) ||
    getSectionById(questionnaire, targetId);
  let targetPosition = targetElement.position;

  let targetContainer =
    getFolderByPageId(questionnaire, targetElement.id) ||
    getSectionByFolderId(questionnaire, targetElement.id) ||
    getSectionById(questionnaire, targetElement.id);

  if (targetContainer?.__typename === "Folder" && !targetContainer?.enabled) {
    targetPosition = targetContainer.position;
    targetContainer = getSectionByFolderId(questionnaire, targetContainer.id);
  }

  // reject iffy calls
  if (
    sourceElement.__typename === "Folder" &&
    targetContainer?.__typename === "Folder"
  ) {
    return -1;
  }
  if (
    sourceElement.__typename === "Section" &&
    targetElement.__typename !== "Section"
  ) {
    return -1;
  }

  // set values
  let targetSectionId =
    getSectionByPageId(questionnaire, targetElement.id)?.id ||
    getSectionByFolderId(questionnaire, targetElement.id)?.id ||
    getSectionById(questionnaire, targetElement.id)?.id;
  let targetFolderId;
  let position;

  // set position
  position = placement === "above" ? targetPosition : targetPosition + 1;
  if (sourceContainer.id === targetContainer.id) {
    position = sourcePosition < targetPosition ? position - 1 : position;
  }
  if (
    targetElement.__typename === "Section" ||
    (targetElement.__typename === "Folder" &&
      sourceContainer.__typename !== "Section")
  ) {
    position = 0;
  }
  if (
    sourceElement.__typename === "Section" &&
    targetElement.__typename === "Section"
  ) {
    position = placement === "above" ? targetPosition : targetPosition + 1;
    position = sourcePosition < targetPosition ? position - 1 : position;
  }

  // move a page
  if (sourceElement.__typename.includes("Page")) {
    const sourcePageFolder = getFolderByPageId(questionnaire, sourceElement.id);
    sourcePageFolder.pages.splice(
      sourcePageFolder.pages.indexOf(sourceElement),
      1
    );
    if (!sourcePageFolder.enabled && !sourcePageFolder.pages.length) {
      sourceContainer.folders.splice(
        sourceContainer.folders.indexOf(sourcePageFolder),
        1
      );
    }
    if (targetContainer.__typename === "Folder") {
      targetContainer.pages.splice(position, 0, sourceElement);
      targetFolderId = targetContainer.id;
    }
    if (targetContainer.__typename === "Section") {
      const newFolder = {
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
      targetContainer.folders.splice(position, 0, newFolder);
    }

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
  if (sourceElement.__typename === "Folder") {
    sourceContainer.folders.splice(
      sourceContainer.folders.indexOf(sourceElement),
      1
    );
    targetContainer.folders.splice(position, 0, sourceElement);

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
  if (sourceElement.__typename === "Section") {
    questionnaire.sections.splice(
      questionnaire.sections.indexOf(sourceElement),
      1
    );
    questionnaire.sections.splice(position, 0, sourceElement);

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
  }

  return 1;
};
