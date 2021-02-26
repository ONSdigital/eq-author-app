import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query, Subscription } from "react-apollo";
import { Switch, Route, Redirect } from "react-router-dom";
import { Titled } from "react-titled";
import { get, find, flowRight, flatMap, some } from "lodash";

import pageRoutes from "App/page";
import sectionRoutes from "App/section";
import questionConfirmationRoutes from "App/questionConfirmation";
import introductionRoutes from "App/introduction";
import metadataRoutes from "App/metadata";
import historyRoutes from "App/history";
import publishRoutes from "App/publish";
import reviewRoutes from "App/review";
import qcodeRoutes from "App/qcodes";
import sharingRoutes from "App/sharing";
import settingsRoutes from "App/settings";
import folderRoutes from "App/folder";

import {
  useCreateFolder,
  useCreatePageWithFolder,
} from "hooks/useCreateFolder";
import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";

import withCreateSection from "enhancers/withCreateSection";
import withCreateCalculatedSummaryPage from "enhancers/withCreateCalculatedSummaryPage";
import withCreateQuestionConfirmation from "./withCreateQuestionConfirmation";

import MainNavigation from "./MainNavigation";
import NavigationSidebar from "./NavigationSidebar";
import { QCodeContext } from "components/QCodeContext";
import { Grid, Column } from "components/Grid";
import BaseLayout from "components/BaseLayout";
import QuestionnaireContext from "components/QuestionnaireContext";
import ScrollPane from "components/ScrollPane";
import Loading from "components/Loading";

import {
  organiseAnswers,
  flattenAnswers,
  duplicatesAnswers,
} from "utils/getAllAnswersFlatMap";
import { buildSectionPath, buildIntroductionPath } from "utils/UrlUtils";

import QUESTIONNAIRE_QUERY from "./getQuestionnaireQuery.graphql";
import ValidationErrorInfo from "graphql/fragments/validationErrorInfo.graphql";

import { colors } from "constants/theme";
import {
  SECTION,
  FOLDER,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
} from "constants/entities";
import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

const NavColumn = styled(Column)`
  background-color: ${colors.darkerBlack};
`;

const MainNav = styled.div`
  width: 72px;
  border: 0;
  float: left;
  background-color: ${colors.darkerBlack};
`;

export const getSections = (questionnaire) => questionnaire.sections;
export const getFolders = (questionnaire) =>
  flatMap(getSections(questionnaire), ({ folders }) => folders);
export const getPages = (questionnaire) =>
  flatMap(getFolders(questionnaire), ({ pages }) => pages);

export const getFolderById = (questionnaire, folderId) =>
  find(getFolders(questionnaire), ({ id }) => id === folderId);
export const getFolderByPageId = (questionnaire, id) =>
  find(getFolders(questionnaire), ({ pages }) => some(pages, { id }));
export const getSectionByFolderId = (questionnaire, id) =>
  find(getSections(questionnaire), ({ folders }) => some(folders, { id }));
export const getSectionByPageId = (questionnaire, id) =>
  find(getSections(questionnaire), ({ folders }) =>
    some(folders, ({ pages }) => some(pages, { id }))
  );
export const getPageById = (questionnaire, id) =>
  find(getPages(questionnaire), { id });
export const getPageByConfirmationId = (questionnaire, id) =>
  find(getPages(questionnaire), ({ confirmation }) => confirmation.id === id);

export const UnwrappedQuestionnaireDesignPage = ({
  onAddSection,
  onCreateQuestionConfirmation,
  match,
  questionnaire,
  loading,
  error,
  location,
}) => {
  // TODO make sure calculated summary works
  // Make sure that the conf q works too
  // Fix animation when adding a question inside folder

  // The order in which I would like to do things right now
  // First get calculated summaries working again
  // then get rid of all of this junk
  const onAddQuestionPage = useCreateQuestionPage();
  const onAddCalculatedSummaryPage = useCreateCalculatedSummaryPage();
  const addFolder = useCreateFolder();
  const addFolderWithPage = useCreatePageWithFolder();

  const { entityName, entityId } = match.params;

  const canAddQuestionAndCalculatedSummmaryPages = () => {
    return !loading && [PAGE, FOLDER, SECTION].includes(entityName);
  };

  const canAddQuestionConfirmation = () => {
    if (loading || !questionnaire || entityName !== PAGE) {
      return false;
    }

    const page = getPageById(questionnaire, entityId);

    // TODO make this constant
    return !page || page.confirmation || page.pageType !== "QuestionPage";
  };

  const canAddFolder = () => {
    return !loading && ![INTRODUCTION].includes(entityName);
  };

  // keep this the exact same
  const handleAddPage = (createInsideFolder) => {
    switch (entityName) {
      case SECTION:
        return addFolderWithPage({
          sectionId: entityId,
          position: 0,
        });
      case PAGE:
        return onAddQuestionPage({
          folderId: getFolderByPageId(questionnaire, entityId).id,
          position: getPageById(questionnaire, entityId).position + 1,
        });
      case FOLDER:
        if (createInsideFolder) {
          return onAddQuestionPage({
            folderId: entityId,
            position: 0,
          });
        }
        return addFolderWithPage({
          sectionId: getSectionByFolderId(questionnaire, entityId).id,
          position: getFolderById(questionnaire, entityId).position + 1,
        });
      default:
        break;
    }
  };

  const handleAddCalculatedSummaryPage = (createInsideFolder) => {
    switch (entityName) {
      case SECTION:
        return addFolderWithPage({
          sectionId: entityId,
          position: getFolders(questionnaire).length + 1,
          isCalcSum: true,
        });
      case PAGE:
        return onAddCalculatedSummaryPage({
          folderId: getFolderByPageId(questionnaire, entityId).id,
          position: getPageById(questionnaire, entityId).position + 1,
        });
      case FOLDER:
        if (createInsideFolder) {
          return onAddCalculatedSummaryPage({
            folderId: entityId,
            position: getFolderById(questionnaire, entityId).pages.length + 1,
          });
        }
        return addFolderWithPage({
          sectionId: getSectionByFolderId(questionnaire, entityId).id,
          position: getFolderById(questionnaire, entityId).position + 1,
          isCalcSum: true,
        });
      default:
        break;
    }
  };

  const handleAddFolder = () => {
    const { entityName, entityId } = match.params;

    let position, sectionId, page;

    switch (entityName) {
      case SECTION:
        addFolder({ sectionId: entityId, position: 0, enabled: true });
        break;
      case FOLDER:
        ({ position } = getFolderById(questionnaire, entityId));
        ({ id: sectionId } = getSectionByFolderId(questionnaire, entityId));
        addFolder({ sectionId, position: position + 1, enabled: true });
        break;
      case PAGE:
        ({ position } = getFolderByPageId(questionnaire, entityId));
        ({ id: sectionId } = getSectionByPageId(questionnaire, entityId));
        addFolder({ sectionId, position: position + 1, enabled: true });
        break;
      case QUESTION_CONFIRMATION:
        page = getPageByConfirmationId(questionnaire, entityId);
        ({ position } = getFolderByPageId(questionnaire, page.id));
        ({ id: sectionId } = getSectionByPageId(questionnaire, page.id));
        addFolder({ sectionId, position: position + 1, enabled: true });
        break;
      default:
        throw new Error(
          `Adding a folder when focused on entity ${entityName} with ID ${entityId} is not supported.`
        );
    }
  };

  const handleAddQuestionConfirmation = () => {
    onCreateQuestionConfirmation(entityId);
  };

  const renderRedirect = () => {
    if (loading) {
      return (
        <Grid>
          <Column cols={10}>
            <Loading height="100%">Loading questionnaire…</Loading>
          </Column>
        </Grid>
      );
    }

    if (questionnaire.introduction) {
      return (
        <Redirect
          to={buildIntroductionPath({
            questionnaireId: questionnaire.id,
            introductionId: questionnaire.introduction.id,
          })}
        />
      );
    }

    return (
      <Redirect
        to={buildSectionPath({
          questionnaireId: questionnaire.id,
          sectionId: questionnaire.sections[0].id,
        })}
      />
    );
  };

  if (!loading && !error && !questionnaire) {
    throw new Error(ERR_PAGE_NOT_FOUND);
  }

  let flattenedAnswers;
  let duplicates;
  let duplicateQCode = false;

  if (questionnaire) {
    const sections = questionnaire.sections;
    const { answers } = organiseAnswers(sections);

    flattenedAnswers = flattenAnswers(answers);

    duplicates = duplicatesAnswers(flattenedAnswers);

    if (duplicates) {
      for (let key in duplicates) {
        if (duplicates[key] > 1) {
          duplicateQCode = true;
        }
      }
    }
  }

  return (
    <QuestionnaireContext.Provider value={{ questionnaire }}>
      <BaseLayout questionnaire={questionnaire}>
        <ScrollPane>
          <Titled title={() => (loading ? "" : questionnaire.title)}>
            <Grid>
              <QCodeContext.Provider
                value={{ flattenedAnswers, duplicates, duplicateQCode }}
              >
                <NavColumn cols={3} gutters={false}>
                  <MainNav>
                    <MainNavigation />
                  </MainNav>
                  <NavigationSidebar
                    data-test="side-nav"
                    onAddSection={onAddSection}
                    onAddQuestionPage={handleAddPage}
                    canAddQuestionPage={canAddQuestionAndCalculatedSummmaryPages()}
                    onAddCalculatedSummaryPage={handleAddCalculatedSummaryPage}
                    canAddCalculatedSummaryPage={canAddQuestionAndCalculatedSummmaryPages()}
                    canAddQuestionConfirmation={canAddQuestionConfirmation()}
                    onAddQuestionConfirmation={handleAddQuestionConfirmation}
                    canAddFolder={canAddFolder()}
                    onAddFolder={handleAddFolder}
                    questionnaire={questionnaire}
                  />
                </NavColumn>
                <Column cols={9} gutters={false}>
                  <Switch location={location}>
                    {[
                      ...pageRoutes,
                      ...sectionRoutes,
                      ...questionConfirmationRoutes,
                      ...introductionRoutes,
                      ...metadataRoutes,
                      ...historyRoutes,
                      ...publishRoutes,
                      ...reviewRoutes,
                      ...qcodeRoutes,
                      ...sharingRoutes,
                      ...settingsRoutes,
                      ...folderRoutes,
                    ]}
                    <Route path="*" render={renderRedirect} />
                  </Switch>
                </Column>
              </QCodeContext.Provider>
            </Grid>
          </Titled>
        </ScrollPane>
      </BaseLayout>
    </QuestionnaireContext.Provider>
  );
};

UnwrappedQuestionnaireDesignPage.propTypes = {
  onAddCalculatedSummaryPage: PropTypes.func.isRequired,
  onCreateQuestionConfirmation: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  match: CustomPropTypes.match.isRequired,
  questionnaire: CustomPropTypes.questionnaire,
  location: PropTypes.object, // eslint-disable-line
  error: PropTypes.object, // eslint-disable-line
  validations: PropTypes.object, // eslint-disable-line
};

const withMutations = flowRight(
  withCreateSection,
  withCreateQuestionConfirmation,
  withCreateCalculatedSummaryPage
);

export const withQuestionnaire = (Component) => {
  const WrappedComponent = (props) => (
    <Query
      query={QUESTIONNAIRE_QUERY}
      variables={{
        input: {
          questionnaireId: props.match.params.questionnaireId,
        },
      }}
      fetchPolicy="network-only"
      errorPolicy="all"
    >
      {(innerProps) => (
        <Component
          {...innerProps}
          {...props}
          questionnaire={get(innerProps, "data.questionnaire")}
        />
      )}
    </Query>
  );

  WrappedComponent.displayName = `withQuestionnaire(${Component.displayName})`;
  WrappedComponent.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  return WrappedComponent;
};

export const withAuthCheck = (Component) => {
  const WrappedComponent = (props) => {
    if (
      get(props, "error.networkError.bodyText") ===
      ERR_UNAUTHORIZED_QUESTIONNAIRE
    ) {
      throw new Error(ERR_UNAUTHORIZED_QUESTIONNAIRE);
    }
    return <Component {...props} />;
  };
  WrappedComponent.displayName = `withAuthCheck(${Component.displayName})`;
  return WrappedComponent;
};

export const VALIDATION_QUERY = gql`
  subscription Validation($id: ID!) {
    validationUpdated(id: $id) {
      id
      totalErrorCount
      sections {
        id
        validationErrorInfo {
          ...ValidationErrorInfo
        }
        folders {
          id
          pages {
            id
            validationErrorInfo {
              ...ValidationErrorInfo
            }
            ... on QuestionPage {
              confirmation {
                id
                validationErrorInfo {
                  ...ValidationErrorInfo
                }
              }
              answers {
                ... on BasicAnswer {
                  id
                  validationErrorInfo {
                    ...ValidationErrorInfo
                  }
                  validation {
                    ... on NumberValidation {
                      minValue {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                      maxValue {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                    }
                    ... on DateValidation {
                      earliestDate {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                      latestDate {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                    }
                    ... on DateRangeValidation {
                      earliestDate {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                      latestDate {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                      minDuration {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                      maxDuration {
                        id
                        validationErrorInfo {
                          ...ValidationErrorInfo
                        }
                      }
                    }
                  }
                }
                ... on MultipleChoiceAnswer {
                  id
                  validationErrorInfo {
                    ...ValidationErrorInfo
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${ValidationErrorInfo}
`;

export const withValidations = (Component) => {
  const WrappedComponent = (props) => (
    <Subscription
      subscription={VALIDATION_QUERY}
      variables={{ id: props.match.params.questionnaireId }}
    >
      {(subscriptionProps) => (
        <Component
          {...props}
          validations={get(subscriptionProps, "data.validationUpdated")}
        />
      )}
    </Subscription>
  );
  WrappedComponent.displayName = `withValidations(${Component.displayName})`;
  WrappedComponent.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  return WrappedComponent;
};

export default flowRight([
  withQuestionnaire,
  withAuthCheck,
  withValidations,
  withMutations,
])(UnwrappedQuestionnaireDesignPage);
