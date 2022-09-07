import React from "react";
import styled from "styled-components";
import {
  Switch,
  Route,
  Redirect,
  useParams,
  useLocation,
} from "react-router-dom";
import { Titled } from "react-titled";
import { useSubscription } from "react-apollo";

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
import keyboardShortcutsRoutes from "App/keyboardShortcuts";
import collectionListsRoutes from "App/collectionLists";
import folderRoutes from "App/folder";
import submissionRoutes from "App/Submission";

import MainNavigation from "./MainNavigation";
import NavigationSidebar from "./NavigationSidebar";
import { QCodeContextProvider } from "components/QCodeContext";
import { Grid, Column } from "components/Grid";
import BaseLayout from "components/BaseLayout";
import QuestionnaireContext from "components/QuestionnaireContext";
import ScrollPane from "components/ScrollPane";
import Loading from "components/Loading";
import { some } from "lodash";

import { buildSectionPath, buildIntroductionPath } from "utils/UrlUtils";

import useLockStatusSubscription from "hooks/useLockStatusSubscription";
import useValidationsSubscription from "hooks/useValidationsSubscription";
import useQuestionnaireQuery from "./useQuestionnaireQuery";
import COMMENT_SUBSCRIPTION from "graphql/subscriptions/commentSubscription.graphql";

import { colors } from "constants/theme";
import hotkeys from "hotkeys-js";

import { CallbackContextProvider } from "components/NavigationCallbacks";
import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

const MainNavScrollPane = styled(ScrollPane)`
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${colors.lightGrey};
    }
  }
`;

const NavColumn = styled(Column)`
  background-color: ${colors.black};
  display: flex;
`;

const MainNav = styled.div`
  width: 104px;
  border: 0;
  background-color: ${colors.black};
  :focus {
    border: 2px solid ${colors.yellow};
  }
`;

hotkeys.filter = function () {
  return true;
};

hotkeys("F6", function (event) {
  event.preventDefault();
  let currentElement = event.target;
  if (!currentElement.classList.contains("keyNav")) {
    currentElement = currentElement.closest(".keyNav");
  }

  const keyNavs = document.querySelectorAll(".keyNav");
  if (!keyNavs.length) {
    return;
  }
  let position = Array.from(keyNavs).indexOf(currentElement);
  if (position === keyNavs.length - 1) {
    position = -1;
  }
  keyNavs[position + 1].focus();
});
hotkeys("shift+f6", function (event) {
  event.preventDefault();
  let currentElement = event.target;
  if (!currentElement.classList.contains("keyNav")) {
    currentElement = currentElement.closest(".keyNav");
  }

  const keyNavs = document.querySelectorAll(".keyNav");
  if (!keyNavs.length) {
    return;
  }
  let position = Array.from(keyNavs).indexOf(currentElement);
  if (position === 0) {
    position = keyNavs.length;
  }
  keyNavs[position - 1].focus();
});

const LoadingPlaceholder = () => (
  <Grid>
    <Column cols={10}>
      <Loading height="100%">Loading questionnaire…</Loading>
    </Column>
  </Grid>
);

export const QuestionnaireDesignPage = () => {
  const location = useLocation();
  const { questionnaireId } = useParams();
  const {
    error,
    loading,
    data: { questionnaire } = {},
    refetch,
  } = useQuestionnaireQuery(questionnaireId);

  useSubscription(COMMENT_SUBSCRIPTION, {
    variables: {
      id: questionnaireId,
    },
    onSubscriptionData: () => {
      refetch();
    },
  });

  const formTypeErrorCount =
    questionnaire?.themeSettings?.validationErrorInfo?.errors.filter(
      ({ errorCode }) => errorCode === "ERR_FORM_TYPE_FORMAT"
    ).length + questionnaire?.validationErrorInfo?.totalCount;

  useLockStatusSubscription({ id: questionnaire?.id });
  useValidationsSubscription({ id: questionnaire?.id });

  if (error?.networkError?.bodyText === ERR_UNAUTHORIZED_QUESTIONNAIRE) {
    throw new Error(ERR_UNAUTHORIZED_QUESTIONNAIRE);
  }

  if (!loading && !error && !questionnaire) {
    throw new Error(ERR_PAGE_NOT_FOUND);
  }

  return (
    <QuestionnaireContext.Provider value={{ questionnaire }}>
      <BaseLayout questionnaire={questionnaire}>
        <ScrollPane>
          <Titled title={() => (loading ? "" : questionnaire.title)}>
            <Grid>
              <QCodeContextProvider questionnaire={questionnaire}>
                <CallbackContextProvider>
                  <NavColumn cols={3} gutters={false}>
                    <MainNav>
                      <MainNavScrollPane>
                        <MainNavigation
                          hasQuestionnaire={Boolean(questionnaire?.id)}
                          totalErrorCount={questionnaire?.totalErrorCount || 0}
                          qcodesEnabled={questionnaire?.qcodes}
                          settingsError={Boolean(
                            questionnaire?.themeSettings?.validationErrorInfo
                              ?.totalCount +
                              questionnaire?.validationErrorInfo?.totalCount
                          )}
                          listsError={some(
                            questionnaire?.collectionLists?.lists,
                            (list) => list.validationErrorInfo.errors.length > 0
                          )}
                          formTypeErrorCount={formTypeErrorCount}
                          hasSurveyID={questionnaire?.surveyId !== ""}
                        />
                      </MainNavScrollPane>
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
                        ...keyboardShortcutsRoutes,
                        ...collectionListsRoutes,
                        ...folderRoutes,
                        ...submissionRoutes,
                      ]}
                      <Route path="*">
                        {loading ? (
                          <LoadingPlaceholder />
                        ) : (
                          <Redirect
                            to={
                              questionnaire.introduction
                                ? buildIntroductionPath({
                                    questionnaireId: questionnaire.id,
                                    introductionId:
                                      questionnaire.introduction.id,
                                  })
                                : buildSectionPath({
                                    questionnaireId: questionnaire.id,
                                    sectionId: questionnaire.sections[0].id,
                                  })
                            }
                          />
                        )}
                      </Route>
                    </Switch>
                  </Column>
                </CallbackContextProvider>
              </QCodeContextProvider>
            </Grid>
          </Titled>
        </ScrollPane>
      </BaseLayout>
    </QuestionnaireContext.Provider>
  );
};

export default QuestionnaireDesignPage;
