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
import { QCodeContextProvider } from "components/QCodeContext";
import { Grid, Column } from "components/Grid";
import BaseLayout from "components/BaseLayout";
import QuestionnaireContext from "components/QuestionnaireContext";
import ScrollPane from "components/ScrollPane";
import Loading from "components/Loading";

import { buildSectionPath, buildIntroductionPath } from "utils/UrlUtils";

import useLockStatusSubscription from "hooks/useLockStatusSubscription";
import useValidationsSubscription from "hooks/useValidationsSubscription";
import useQuestionnaireQuery from "./useQuestionnaireQuery";

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
  } = useQuestionnaireQuery(questionnaireId);

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
                      <MainNavigation
                        hasQuestionnaire={Boolean(questionnaire?.id)}
                        totalErrorCount={questionnaire?.totalErrorCount || 0}
                        qcodesEnabled={questionnaire?.qcodes}
                        settingsError={Boolean(
                          questionnaire?.themeSettings?.validationErrorInfo
                            ?.totalCount +
                            questionnaire?.validationErrorInfo?.totalCount
                        )}
                        formTypeErrorCount={formTypeErrorCount}
                        hasSurveyID={questionnaire?.surveyId !== ""}
                      />
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
