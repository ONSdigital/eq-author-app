import { memoize, curry } from "lodash";
import pathToRegexp from "path-to-regexp";
import { matchPath } from "react-router";

export { matchPath };

// react-router will eventually offer this exact function.
// at that point we can drop this
const compile = memoize(path => pathToRegexp.compile(path));
export const generatePath = curry((path, params) => compile(path)(params));

export const Routes = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  QUESTIONNAIRE: `/questionnaire/:questionnaireId/:sectionId?/:pageId?/:confirmationId?/:tab?`,
  SECTION: `/questionnaire/:questionnaireId/:sectionId/design`,
  PAGE: `/questionnaire/:questionnaireId/:sectionId/:pageId/design`,
  PAGE_PREVIEW: `/questionnaire/:questionnaireId/:sectionId/:pageId?/preview`,
  CONFIRMATION: `/questionnaire/:questionnaireId/:sectionId/:pageId/:confirmationId/design`,
  CONFIRMATION_PREVIEW: `/questionnaire/:questionnaireId/:sectionId/:pageId/:confirmationId?/preview`,
  ROUTING: `/questionnaire/:questionnaireId/:sectionId/:pageId/routing`,
};

export const buildSectionPath = generatePath(Routes.SECTION);
export const buildPagePath = generatePath(Routes.PAGE);
export const buildQuestionnairePath = generatePath(Routes.QUESTIONNAIRE);
export const buildConfirmationPath = generatePath(Routes.CONFIRMATION);

const rewriteTab = tab => params => buildQuestionnairePath({ ...params, tab });

export const buildDesignPath = rewriteTab("design");
export const buildRoutingPath = rewriteTab("routing");
export const buildPreviewPath = rewriteTab("preview");

export const isOnConfirmation = match => Boolean(match.params.confirmationId);
export const isOnPage = match =>
  Boolean(match.params.pageId) && !isOnConfirmation(match);
export const isOnSection = match =>
  Boolean(match.params.sectionId) &&
  !isOnPage(match) &&
  !isOnConfirmation(match);
