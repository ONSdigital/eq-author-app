import React, { useState } from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  position,
}) => {
  const { entityId, tab = "design" } = useParams();

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const iconMap = {
    QuestionPage: IconQuestionPage,
    CalculatedSummaryPage: IconSummaryPage,
  };

  return (
    <Draggable key={pageId} draggableId={pageId} index={position}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <ListItem ref={innerRef} {...draggableProps}>
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
            {...dragHandleProps}
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
              {...dragHandleProps}
            />
          )}
        </ListItem>
      )}
    </Draggable>
  );
};

const Folder = ({
  id: folderId,
  questionnaireId,
  displayName,
  pages,
  validationErrorInfo,
  position,
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
    <Draggable key={folderId} draggableId={folderId} index={position}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <ListItem ref={innerRef} {...draggableProps} {...dragHandleProps}>
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
            <Droppable droppableId={folderId}>
              {({ innerRef, placeholder, droppableProps }) => (
                <NavList ref={innerRef} {...droppableProps}>
                  {pages.map(({ id: pageId, ...rest }) => (
                    <Page
                      key={`page-${pageId}`}
                      id={pageId}
                      questionnaireId={questionnaireId}
                      {...rest}
                    />
                  ))}
                  {placeholder}
                </NavList>
              )}
            </Droppable>
          </CollapsibleNavItem>
        </ListItem>
      )}
    </Draggable>
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

  const renderChild = ({ id: folderId, enabled, pages, position, ...rest }) => {
    if (enabled) {
      return (
        <Folder
          key={`folder-${folderId}`}
          id={folderId}
          questionnaireId={questionnaireId}
          pages={pages}
          position={position}
          {...rest}
        />
      );
    } else {
      // return <p>Page</p>;
      return pages.map(({ id: pageId, ...rest }) => (
        <Page
          key={`page-${pageId}`}
          id={pageId}
          questionnaireId={questionnaireId}
          index={position}
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
        <Droppable droppableId={sectionId}>
          {({ innerRef, placeholder, droppableProps }) => (
            <NavList ref={innerRef} {...droppableProps}>
              {folders.map((folder) => renderChild(folder))}
              {placeholder}
            </NavList>
          )}
        </Droppable>
      </CollapsibleNavItem>
    </ListItem>
  );
};

const NavigationSidebar = ({ questionnaire }) => {
  const { entityId, tab = "design" } = useParams();
  const [openSections, toggleSections] = useState(true);

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const onDragEnd = ({ destination, source, draggableId }) => {
    // The user dropped the item outside a destination
    if (!destination) {
      return;
    }

    // The user dropped the item back where it started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //TODO
    return;
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
              <DragDropContext onDragEnd={onDragEnd}>
                {questionnaire.sections.map(({ id, ...rest }) => (
                  <Section
                    key={`section-${id}`}
                    id={id}
                    questionnaireId={questionnaire.id}
                    {...rest}
                  />
                ))}
              </DragDropContext>
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
