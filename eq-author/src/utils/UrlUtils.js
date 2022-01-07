import { curry } from "lodash";
import { generatePath as rrGeneratePath } from "react-router";

import {
  SECTION,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
  METADATA,
  HISTORY,
  COLLECTIONLISTS,
  PUBLISH,
  QCODES,
  SHARING,
  SETTINGS,
  KEYBOARDSHORTCUTS,
  FOLDER,
  SUBMISSION,
} from "../constants/entities";

export const Routes = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  QUESTIONNAIRE: `/q/:questionnaireId/:entityName?/:entityId?/:tab?/:modifier?`,
};

export const generatePath = curry(rrGeneratePath, 2);

export const buildQuestionnairePath = generatePath(Routes.QUESTIONNAIRE);

const sanitiseTab = (allowedTabs) => (tab) => {
  if (!tab) {
    return allowedTabs[0];
  }
  if (!allowedTabs.includes(tab)) {
    return allowedTabs[0];
  }
  return tab;
};

export const buildSectionPath = ({ sectionId, tab, ...rest }) => {
  if (!sectionId) {
    throw new Error("Section id must be provided");
  }

  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "preview", "logic", "display"])(tab),
    entityId: sectionId,
    entityName: SECTION,
  });
};
export const buildFolderPath = ({ folderId, tab, ...rest }) => {
  if (!folderId) {
    throw new Error("Folder id must be provided");
  }

  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "logic", "skip", "routing"])(tab),
    entityId: folderId,
    entityName: FOLDER,
  });
};
export const buildPagePath = ({ pageId, tab, ...rest }) => {
  if (!pageId) {
    throw new Error("Page id must be provided");
  }
  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "routing", "skip", "logic", "preview"])(tab),
    entityId: pageId,
    entityName: PAGE,
  });
};
export const buildConfirmationPath = ({ confirmationId, tab, ...rest }) => {
  if (!confirmationId) {
    throw new Error("Confirmation id must be provided");
  }
  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "routing", "skip", "logic", "preview"])(tab),
    entityId: confirmationId,
    entityName: QUESTION_CONFIRMATION,
  });
};
export const buildIntroductionPath = ({ introductionId, tab, ...rest }) => {
  if (!introductionId) {
    throw new Error("Confirmation id must be provided");
  }
  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "preview"])(tab),
    entityId: introductionId,
    entityName: INTRODUCTION,
  });
};
export const buildSubmissionPath = ({ submissionId, tab, ...rest }) => {
  if (!submissionId) {
    throw new Error("Submission id must be provided");
  }

  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "preview"])(tab),
    entityId: submissionId,
    entityName: SUBMISSION,
  });
};
export const buildMetadataPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: METADATA,
  });
};

export const buildHistoryPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: HISTORY,
  });
};

export const buildCollectionListsPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: COLLECTIONLISTS,
  });
};

export const buildPublishPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: PUBLISH,
  });
};

export const buildSettingsPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: SETTINGS,
  });
};

export const buildQcodesPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: QCODES,
  });
};
export const buildShortcutsPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: KEYBOARDSHORTCUTS,
  });
};

export const buildSharingPath = ({ questionnaireId }) => {
  return generatePath(Routes.QUESTIONNAIRE)({
    questionnaireId,
    entityName: SHARING,
  });
};

const buildTabSwitcher = (tab) => (params) => {
  let builder;
  if (params.entityId) {
    builder = buildQuestionnairePath;
  }
  if (params.sectionId) {
    builder = buildSectionPath;
  }
  if (params.pageId) {
    builder = buildPagePath;
  }
  if (params.confirmationId) {
    builder = buildConfirmationPath;
  }
  if (params.introductionId) {
    builder = buildIntroductionPath;
  }
  if (params.folderId) {
    builder = buildFolderPath;
  }
  if (params.submissionId) {
    builder = buildSubmissionPath;
  }
  if (!builder) {
    throw new Error(
      `Cannot find builder for params: ${JSON.stringify(params)}`
    );
  }

  return builder({ ...params, tab });
};

export const buildDesignPath = buildTabSwitcher("design");
export const buildPreviewPath = buildTabSwitcher("preview");
export const buildLogicPath = buildTabSwitcher("logic");
