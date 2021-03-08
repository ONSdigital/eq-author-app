import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query, Subscription } from "react-apollo";
import { Switch, Route, Redirect } from "react-router-dom";
import { Titled } from "react-titled";
import { get, flowRight } from "lodash";

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

import { CallbackContextProvider } from "components/NavigationCallbacks";
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

export const UnwrappedQuestionnaireDesignPage = ({
  loading,
  error,
  questionnaire,
  location,
}) => {
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
      <BaseLayout questionnaire={questionnaire} data-test="base-layout">
        <ScrollPane>
          <Titled title={() => (loading ? "" : questionnaire.title)}>
            <Grid>
              <QCodeContext.Provider
                value={{ flattenedAnswers, duplicates, duplicateQCode }}
              >
                <CallbackContextProvider>
                  <NavColumn cols={3} gutters={false}>
                    <MainNav>
                      <MainNavigation />
                    </MainNav>
                    <NavigationSidebar
                      data-test="side-nav"
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
                </CallbackContextProvider>
              </QCodeContext.Provider>
            </Grid>
          </Titled>
        </ScrollPane>
      </BaseLayout>
    </QuestionnaireContext.Provider>
  );
};

UnwrappedQuestionnaireDesignPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  match: CustomPropTypes.match.isRequired,
  questionnaire: CustomPropTypes.questionnaire,
  location: PropTypes.object, // eslint-disable-line
  error: PropTypes.object, // eslint-disable-line
  validations: PropTypes.object, // eslint-disable-line
};

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

export default flowRight([withQuestionnaire, withAuthCheck, withValidations])(
  UnwrappedQuestionnaireDesignPage
);
