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
import pageskipRoutes from "App/pageskip";
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
import hotkeys from "hotkeys-js";

import { CallbackContextProvider } from "components/NavigationCallbacks";
import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

const NavColumn = styled(Column)`
  background-color: ${colors.black};
`;

const MainNav = styled.div`
  width: 72px;
  border: 0;
  float: left;
  background-color: ${colors.black};
  :focus {
    border: 2px solid ${colors.yellow};
  }
`;

const idList = [
  { id: "SuperNav-1", active: false },
  // { id: "SuperNav-2", active: false },
  { id: "SuperNav-3", active: false },
  { id: "SuperNav-4", active: false },
  { id: "SuperNav-5", active: false },
];

let firstMenuItem = document.getElementById("SuperNav-1");

// Navigate forwards using f6
hotkeys("f6", function (event) {
  event.preventDefault();

  let currentElement;
  const firstElement = idList[0];
  // idList[idList.length - 1] gets the last element in the array
  const lastElement = idList[idList.length - 1];

  // Finds the currently active element and assigns the currentElement value to the active element
  idList.forEach((element) => {
    if (element.active) {
      currentElement = element;
      return;
    }
  });

  // If no element is currently active, set the first element to be active and focus on it
  if (currentElement === undefined) {
    firstElement.active = true;
    currentElement = firstElement;
    document.getElementById(firstElement.id).focus();
  }
  // If the last element is active, return to the first element and focus on it
  else if (lastElement.active) {
    lastElement.active = false;
    firstElement.active = true;
    document.getElementById(firstElement.id).focus();
  }
  // If any other element is active than the last element, move onto the next element
  else {
    const currentElementIndex = idList.indexOf(currentElement);
    idList.find((element) => element.id === currentElement.id).active = false;
    idList[currentElementIndex + 1].active = true;
    currentElement = idList[currentElementIndex + 1];
    document.getElementById(idList[currentElementIndex + 1].id).focus();
  }
});

// Navigate backwards using f7
hotkeys("f7", function (event) {
  event.preventDefault();

  let currentElement;
  const firstElement = idList[0];
  // idList[idList.length - 1] gets the last element in the array
  const lastElement = idList[idList.length - 1];

  // Finds the currently active element and assigns the currentElement value to the active element
  idList.forEach((element) => {
    if (element.active) {
      currentElement = element;
      return;
    }
  });

  // If no element is currently active, set the last element to be active and focus on it
  if (currentElement === undefined) {
    lastElement.active = true;
    currentElement = lastElement;
    document.getElementById(lastElement.id).focus();
  }
  // If the first element is active, return to the last element and focus on it
  else if (firstElement.active) {
    firstElement.active = false;
    lastElement.active = true;
    document.getElementById(lastElement.id).focus();
  }
  // If any other element is active than the first element, move back to the previous element
  else {
    const currentElementIndex = idList.indexOf(currentElement);
    idList.find((element) => element.id === currentElement.id).active = false;
    idList[currentElementIndex - 1].active = true;
    currentElement = idList[currentElementIndex - 1];
    document.getElementById(idList[currentElementIndex - 1].id).focus();
  }
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
                        ...pageskipRoutes,
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
