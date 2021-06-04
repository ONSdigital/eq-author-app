import React, { useState } from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
import { useParams } from "react-router-dom";

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

import IconSection from "assets/icon-section.svg?inline";
import IconFolder from "assets/icon-folder.svg?inline";
import IconQuestionPage from "assets/icon-questionpage.svg?inline";
import IconConfirmationPage from "assets/icon-playback.svg?inline";
import IconSummaryPage from "assets/icon-summarypage.svg?inline";
import PageIcon from "assets/icon-survey-intro.svg?inline";

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

const OpenAllSectionsBtn = styled(Button).attrs({
  variant: "tertiary-light",
  small: true,
})`
  margin: 0 0 0.5em 2em;
  border: 1px solid white;
  padding: 0.5em;
  align-self: baseline;
  font-size: 0.9em;

  &:focus {
    outline: 3px solid #fdbd56;
    outline-offset: -3px;
  }
`;

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li``;

const IntroductionListItem = styled(ListItem)`
  padding-left: 2em;
  margin-bottom: 0.5em;
  margin-top: 2px;

  span {
    font-weight: bold;
  }
`;

const Page = ({
  id: pageId,
  questionnaireId,
  displayName,
  pageType,
  confirmation,
  validationErrorInfo,
  ...rest
}) => {
  const { entityId, tab = "design" } = useParams();

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const iconMap = {
    QuestionPage: IconQuestionPage,
    CalculatedSummaryPage: IconSummaryPage,
  };

  return (
    <ListItem>
      {console.log(rest)}
      <NavItem
        title={displayName}
        icon={iconMap[pageType]}
        disabled={isCurrentPage(pageId, entityId)}
        titleUrl={buildPagePath({
          questionnaireId,
          pageId,
          tab,
        })}
        errorCount={validationErrorInfo?.totalCount}
      />
      {confirmation && (
        <NavItem
          key={confirmation.displayName}
          title={confirmation.displayName}
          titleUrl={buildConfirmationPath({
            questionnaireId,
            confirmationId: confirmation.id,
            tab,
          })}
          disabled={isCurrentPage(confirmation.id, entityId)}
          icon={IconConfirmationPage}
          errorCount={confirmation?.validationErrorInfo?.totalCount}
        />
      )}
    </ListItem>
  );
};

const Folder = ({
  id: folderId,
  questionnaireId,
  displayName,
  pages,
  validationErrorInfo,
}) => {
  const { entityId, tab = "design" } = useParams();

  const isCurrentFolder = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const calculatePageErrors = (pages) =>
    pages.reduce(
      (acc, { validationErrorInfo }) => (acc += validationErrorInfo.totalCount),
      0
    );

  return (
    <ListItem>
      <CollapsibleNavItem
        title={displayName}
        icon={IconFolder}
        disabled={isCurrentFolder(folderId, entityId)}
        titleUrl={buildFolderPath({
          questionnaireId,
          folderId,
          tab,
        })}
        selfErrorCount={validationErrorInfo.totalCount}
        childErrorCount={calculatePageErrors(pages)}
      >
        <NavList>
          {pages.map(({ id: pageId, ...rest }) => (
            <Page
              key={`page-${pageId}`}
              id={pageId}
              questionnaireId={questionnaireId}
              {...rest}
            />
          ))}
        </NavList>
      </CollapsibleNavItem>
    </ListItem>
  );
};

const Section = ({
  id: sectionId,
  questionnaireId,
  displayName,
  folders,
  validationErrorInfo,
}) => {
  const { entityId, tab = "design" } = useParams();

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const calculatePageErrors = (pages) =>
    pages.reduce(
      (acc, { validationErrorInfo }) => (acc += validationErrorInfo.totalCount),
      0
    );

  const allPagesInSection = folders.flatMap(({ pages }) => pages);

  const renderChild = ({ id: folderId, enabled, pages, ...rest }) => {
    if (enabled) {
      return (
        <Folder
          key={`folder-${folderId}`}
          id={folderId}
          questionnaireId={questionnaireId}
          pages={pages}
          {...rest}
        />
      );
    } else {
      return pages.map(({ id: pageId, ...rest }) => (
        <Page
          key={`page-${pageId}`}
          id={pageId}
          questionnaireId={questionnaireId}
          {...rest}
        />
      ));
    }
  };

  return (
    <ListItem>
      <CollapsibleNavItem
        title={displayName}
        icon={IconSection}
        bordered
        disabled={isCurrentPage(sectionId, entityId)}
        titleUrl={buildSectionPath({
          questionnaireId,
          sectionId,
          tab,
        })}
        selfErrorCount={validationErrorInfo.totalCount}
        childErrorCount={calculatePageErrors(allPagesInSection)}
        containsActiveEntity={allPagesInSection
          .map(({ id }) => isCurrentPage(id, entityId))
          .find(Boolean)}
      >
        <NavList>{folders.map((folder) => renderChild(folder))}</NavList>
      </CollapsibleNavItem>
    </ListItem>
  );
};

const NavigationSidebar = ({ questionnaire }) => {
  const { entityId, tab = "design" } = useParams();
  const [openSections, toggleSections] = useState(true);

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

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
                <IntroductionListItem>
                  <NavItem
                    key={"introduction"}
                    title="Introduction"
                    titleUrl={buildIntroductionPath({
                      questionnaireId: questionnaire.id,
                      introductionId: questionnaire.introduction.id,
                      tab,
                    })}
                    disabled={isCurrentPage(
                      questionnaire.introduction.id,
                      entityId
                    )}
                    icon={PageIcon}
                  />
                </IntroductionListItem>
              )}
              {questionnaire.sections.map(({ id, ...rest }) => (
                <Section
                  key={`section-${id}`}
                  id={id}
                  questionnaireId={questionnaire.id}
                  {...rest}
                />
              ))}
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
