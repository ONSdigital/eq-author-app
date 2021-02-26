import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
import { flowRight } from "lodash";
import { useParams, useHistory } from "react-router-dom";

import {
  buildSectionPath,
  buildFolderPath,
  buildPagePath,
  buildConfirmationPath,
  buildIntroductionPath,
} from "utils/UrlUtils";

import CollapsibleNavItem from "components/CollapsibleNavItem";
import NavItem from "components/NavItem";

import NavigationHeader from "./NavigationHeader";

import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";
import NavItemTransition from "./NavItemTransition";
import scrollIntoView from "utils/scrollIntoView";

import IconSection from "assets/icon-section.svg?inline";
import IconFolder from "assets/icon-folder.svg?inline";
import IconQuestionPage from "assets/icon-questionpage.svg?inline";
import IconConfirmationPage from "assets/icon-playback.svg?inline";
import IconSummaryPage from "assets/icon-summarypage.svg?inline";
import PageIcon from "./icon-survey-intro.svg?inline";
import { TransitionGroup } from "react-transition-group";

const Container = styled.div`
  background: ${colors.black};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavigationScrollPane = styled(ScrollPane)`
  float: left;
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${colors.lightGrey};
    }
  }
`;

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const OpenAllSectionsBtn = styled(Button).attrs({
  variant: "tertiary-light",
  small: true,
})`
  margin: 0.8em 0 0.425em 2.2em;
  border: 1px solid white;
  top: 1px; /* adjust for misalignment caused by PopoutContainer */
  padding: 0.5em;
  align-self: baseline;
  font-size: 0.9em;
  &:focus {
    outline: 3px solid #fdbd56;
    outline-offset: -3px;
  }
`;

const Introduction = styled(NavItem)`
  margin-left: 2em;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
`;

const QuestionPage = "QuestionPage";
const CalculatedSummaryPage = "CalculatedSummaryPage";

const NavigationSidebar = ({ questionnaire }) => {
  const { entityId } = useParams();
  const history = useHistory();
  const [openSections, toggleSections] = useState(true);

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const calculatePageErrors = (pages) =>
    pages.reduce(
      (acc, { validationErrorInfo }) => (acc += validationErrorInfo.totalCount),
      0
    );

  const buildPageList = ({
    id: pageId,
    displayName,
    confirmation,
    pageType,
    validationErrorInfo,
  }) => {
    const components = [];
    if (confirmation) {
      components.push(
        <NavItemTransition
          key={`transition-page-${pageId}-confirmation`}
          onEntered={scrollIntoView}
        >
          <li key={`page-${pageId}-confirmation`}>
            <NavItem
              key={confirmation.displayName}
              title={confirmation.displayName}
              titleUrl={buildConfirmationPath({
                questionnaireId: questionnaire.id,
                confirmationId: confirmation.id,
                tab: "design",
              })}
              disabled={isCurrentPage(confirmation.id, entityId)}
              icon={IconConfirmationPage}
              errorCount={confirmation.validationErrorInfo.totalCount}
              history={history}
            />
          </li>
        </NavItemTransition>
      );
    }
    components.push(
      <NavItemTransition key={`transition-page-${pageId}`}>
        <li key={`page-${pageId}`}>
          <NavItem
            key={pageId}
            title={displayName}
            titleUrl={buildPagePath({
              questionnaireId: questionnaire.id,
              pageId,
              tab: "design",
            })}
            disabled={isCurrentPage(pageId, entityId)}
            icon={
              (pageType === QuestionPage && IconQuestionPage) ||
              (pageType === CalculatedSummaryPage && IconSummaryPage)
            }
            errorCount={validationErrorInfo.totalCount}
            history={history}
          />
        </li>
      </NavItemTransition>
    );
    return components;
  };

  const buildFolderList = (folders) => {
    const components = folders.map(
      ({ id: folderId, enabled, alias, pages }) => {
        if (enabled) {
          return (
            <NavItemTransition
              key={`transition-folder-${folderId}-enabled`}
              onEntered={scrollIntoView}
            >
              <li key={`folder-${folderId}-enabled`}>
                <CollapsibleNavItem
                  key={`folder-${folderId}enabled`}
                  title={alias || "Untitled folder"}
                  titleUrl={buildFolderPath({
                    questionnaireId: questionnaire.id,
                    folderId,
                    tab: "design",
                  })}
                  disabled={isCurrentPage(folderId, entityId)}
                  icon={IconFolder}
                  childErrorCount={calculatePageErrors(pages)}
                  history={history}
                  open
                >
                  <NavList>
                    <TransitionGroup
                      key={`transition-group-pages`}
                      component={null}
                    >
                      {pages.map((page) => buildPageList(page))}
                    </TransitionGroup>
                  </NavList>
                </CollapsibleNavItem>
              </li>
            </NavItemTransition>
          );
        }
        if (!enabled) {
          return pages.map((page) => buildPageList(page));
        }

        return null;
      }
    );

    return (
      <TransitionGroup key={`transition-group-section-items`} component={null}>
        {components.flat(2)}
      </TransitionGroup>
    );
  };

  const buildSectionsList = (sections) => {
    const components = sections.map(
      ({ id: sectionId, displayName, folders, validationErrorInfo }) => {
        const allPagesInSection = folders.flatMap(({ pages }) => pages);

        return (
          <NavItemTransition
            key={`transition-section${sectionId}`}
            onEntered={scrollIntoView}
          >
            <li key={`section-${sectionId}`}>
              <CollapsibleNavItem
                key={`section-${sectionId}`}
                title={displayName}
                titleUrl={buildSectionPath({
                  questionnaireId: questionnaire.id,
                  sectionId,
                  tab: "design",
                })}
                bordered
                selfErrorCount={validationErrorInfo.totalCount}
                childErrorCount={calculatePageErrors(allPagesInSection)}
                disabled={isCurrentPage(sectionId, entityId)}
                icon={IconSection}
                history={history}
                open={openSections}
              >
                <NavList>{buildFolderList(folders)}</NavList>
              </CollapsibleNavItem>
            </li>
          </NavItemTransition>
        );
      }
    );

    return (
      <TransitionGroup key={`transition-group-sections`} component={null}>
        {components}
      </TransitionGroup>
    );
  };

  return (
    <Container data-test="side-nav">
      {!questionnaire ? null : (
        <>
          <NavigationHeader data-test="nav-section-header" />
          <OpenAllSectionsBtn onClick={() => toggleSections(!openSections)}>
            {`${openSections ? "Close" : "Open"} all sections`}
          </OpenAllSectionsBtn>
          <NavigationScrollPane>
            <NavList>
              {questionnaire.introduction && (
                <li>
                  <Introduction
                    key={"introduction"}
                    title="Introduction"
                    titleUrl={buildIntroductionPath({
                      questionnaireId: questionnaire.id,
                      introductionId: questionnaire.introduction.id,
                      tab: "design",
                    })}
                    disabled={isCurrentPage(
                      questionnaire.introduction.id,
                      entityId
                    )}
                    icon={PageIcon}
                    history={history}
                  />
                </li>
              )}
              {buildSectionsList(questionnaire.sections)}
            </NavList>
          </NavigationScrollPane>
        </>
      )}
    </Container>
  );
};

NavigationSidebar.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
};

export default NavigationSidebar;
