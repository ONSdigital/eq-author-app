import React, { useCallback, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
import { flowRight } from "lodash";
import { withRouter } from "react-router-dom";

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
  margin: 0.425em 0 0.425em 1.8em;
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
`;

const UnwrappedNavigationSidebar = ({
  questionnaire,
  onAddQuestionPage,
  onAddSection,
  onAddFolder,
  onAddCalculatedSummaryPage,
  onAddQuestionConfirmation,
  canAddQuestionConfirmation,
  canAddCalculatedSummaryPage,
  canAddQuestionPage,
  canAddFolder,
  match: {
    params: { entityId },
  },
}) => {
  const [openSections, toggleSections] = useState(true);

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const handleAddSection = useCallback(() => {
    onAddSection(questionnaire.id);
  }, [questionnaire]);

  const calculatePageErrors = pages => {
    let count = 0;

    pages.map(
      ({ validationErrorInfo }) => (count += validationErrorInfo.totalCount)
    );

    return count;
  };

  const buildPageList = ({
    id: pageId,
    displayName,
    confirmation,
    pageType,
    validationErrorInfo,
  }) => {
    const components = [];
    if (pageType === "QuestionPage") {
      components.push(
        <NavItemTransition key={`transition-page-${pageId}`}>
          <li key={`page-${pageId}`}>
            <NavItem
              key={pageId}
              title={displayName}
              titleUrl={`#${buildPagePath({
                questionnaireId: questionnaire.id,
                pageId,
                tab: "design",
              })}`}
              active={isCurrentPage(pageId, entityId)}
              icon={IconQuestionPage}
              errorCount={validationErrorInfo.totalCount}
            />
          </li>
        </NavItemTransition>
      );
    }
    if (pageType === "CalculatedSummaryPage") {
      components.push(
        <NavItemTransition key={`transition-page-${pageId}`}>
          <li key={`page-${pageId}`}>
            <NavItem
              key={pageId}
              title={displayName}
              titleUrl={`#${buildPagePath({
                questionnaireId: questionnaire.id,
                pageId,
                tab: "design",
              })}`}
              active={isCurrentPage(pageId, entityId)}
              icon={IconSummaryPage}
              errorCount={validationErrorInfo.totalCount}
            />
          </li>
        </NavItemTransition>
      );
    }
    if (confirmation) {
      components.push(
        <NavItemTransition
          key={`transition-page-${pageId}`}
          onEntered={scrollIntoView}
        >
          <li key={`page-${pageId}`}>
            <NavItem
              key={confirmation.displayName}
              title={confirmation.displayName}
              titleUrl={`#${buildConfirmationPath({
                questionnaireId: questionnaire.id,
                confirmationId: confirmation.id,
                tab: "design",
              })}`}
              active={isCurrentPage(confirmation.id, entityId)}
              icon={IconConfirmationPage}
            />
          </li>
        </NavItemTransition>
      );
    }
    return components;
  };

  const buildFolderList = folders => {
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
                  titleUrl={`#${buildFolderPath({
                    questionnaireId: questionnaire.id,
                    folderId,
                    tab: "design",
                  })}`}
                  active={isCurrentPage(folderId, entityId)}
                  icon={IconFolder}
                  errorCount={calculatePageErrors(pages)}
                  open
                >
                  <NavList>
                    <TransitionGroup
                      key={`transition-group-pages`}
                      component={null}
                    >
                      {pages.map(page => buildPageList(page))}
                    </TransitionGroup>
                  </NavList>
                </CollapsibleNavItem>
              </li>
            </NavItemTransition>
          );
        }
        if (!enabled) {
          return pages.map(page => buildPageList(page));
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

  const buildSectionsList = sections => {
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
                titleUrl={`#${buildSectionPath({
                  questionnaireId: questionnaire.id,
                  sectionId,
                  tab: "design",
                })}`}
                bordered
                errorCount={
                  validationErrorInfo.totalCount +
                  calculatePageErrors(allPagesInSection)
                }
                active={isCurrentPage(sectionId, entityId)}
                icon={IconSection}
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
          <NavigationHeader
            questionnaire={questionnaire}
            onAddSection={handleAddSection}
            onAddCalculatedSummaryPage={onAddCalculatedSummaryPage}
            canAddCalculatedSummaryPage={canAddCalculatedSummaryPage}
            onAddQuestionPage={onAddQuestionPage}
            canAddQuestionPage={canAddQuestionPage}
            onAddQuestionConfirmation={onAddQuestionConfirmation}
            canAddQuestionConfirmation={canAddQuestionConfirmation}
            canAddFolder={canAddFolder}
            onAddFolder={onAddFolder}
            data-test="nav-section-header"
          />
          <OpenAllSectionsBtn onClick={() => toggleSections(!openSections)}>
            {`${openSections ? "Open" : "Close"} all sections`}
          </OpenAllSectionsBtn>
          <NavigationScrollPane>
            <NavList>
              {questionnaire.introduction && (
                <li>
                  <Introduction
                    key={"introduction"}
                    title="Introduction"
                    titleUrl={`#${buildIntroductionPath({
                      questionnaireId: questionnaire.id,
                      introductionId: questionnaire.introduction.id,
                      tab: "design",
                    })}`}
                    active={isCurrentPage(
                      questionnaire.introduction.id,
                      entityId
                    )}
                    icon={PageIcon}
                    style={{ marginLeft: "1.5em" }}
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

UnwrappedNavigationSidebar.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  onAddQuestionPage: PropTypes.func.isRequired,
  onAddCalculatedSummaryPage: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onAddQuestionConfirmation: PropTypes.func.isRequired,
  canAddQuestionConfirmation: PropTypes.bool.isRequired,
  canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
  canAddQuestionPage: PropTypes.bool.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  canAddFolder: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired, // eslint-disable-line
};

export default flowRight(withRouter)(UnwrappedNavigationSidebar);
