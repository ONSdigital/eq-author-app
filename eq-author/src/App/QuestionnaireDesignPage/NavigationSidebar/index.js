import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import { useMe } from "App/MeContext";

import { buildIntroductionPath, buildSubmissionPath } from "utils/UrlUtils";
import hasUnreadComments from "utils/hasUnreadComments";
import onDragEnd from "./dragDropFunctions/onDragEnd";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import NavigationHeader from "./NavigationHeader";
import NavItem from "components/NavItem";
import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";

import {
  getPageById,
  getFolderById,
  getSectionById,
} from "utils/questionnaireUtils";

import Section from "./Section";

import IntroductionIcon from "assets/icon-introduction-page.svg?inline";
import SubmissionIcon from "assets/icon-submission-page.svg?inline";

import MOVE_PAGE_MUTATION from "graphql/movePage.graphql";
import MOVE_FOLDER_MUTATION from "graphql/moveFolder.graphql";
import MOVE_SECTION_MUTATION from "graphql/moveSection.graphql";

const Container = styled.div`
  background: ${colors.sidebarBlack};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 104px);
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
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
    outline: 1px solid ${colors.orange};
  }
`;

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ isDraggingOver }) =>
    isDraggingOver &&
    `
    background-color: ${colors.black};

    .CollapsibleNavItem .CollapsibleNavItem-body {
      background-color: ${colors.black};
    }
  `}
`;

const ListItem = styled.li``;

const MenuListItem = styled(ListItem)`
  padding-left: 2em;
  margin-bottom: 0.5em;
  margin-top: 2px;

  span {
    font-weight: bold;
  }
`;

const BorderedNavItem = styled(NavItem)`
  border-bottom: 1px solid ${colors.borders};
  border-top: 1px solid ${colors.borders};
`;

const NavigationSidebar = ({ questionnaire }) => {
  const { me } = useMe();
  const { entityId, tab = "design" } = useParams();
  const [openSections, toggleSections] = useState(true);
  const [entity, setEntity] = useState({}); // Allows data for entity being dragged by user to be used in other droppables

  const [movePage] = useMutation(MOVE_PAGE_MUTATION);
  const [moveFolder] = useMutation(MOVE_FOLDER_MUTATION);
  const [moveSection] = useMutation(MOVE_SECTION_MUTATION);

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const handleDragStart = ({ draggableId }) => {
    // Gets entity being dragged by user if it is a page, folder or section
    const draggingEntity =
      getPageById(questionnaire, draggableId) ||
      getFolderById(questionnaire, draggableId) ||
      getSectionById(questionnaire, draggableId);

    setEntity(draggingEntity);
  };

  const handleDragEnd = ({ destination, source, draggableId }) =>
    onDragEnd(
      questionnaire,
      destination,
      source,
      draggableId,
      movePage,
      moveFolder,
      moveSection
    );

  return (
    <Container data-test="side-nav" tabIndex="-1" className="keyNav">
      {!questionnaire ? null : (
        <>
          <NavigationHeader data-test="nav-section-header" />
          <OpenAllSectionsBtn onClick={() => toggleSections(!openSections)}>
            {`${openSections ? "Close" : "Open"} all sections`}
          </OpenAllSectionsBtn>
          <NavigationScrollPane>
            <NavList>
              {questionnaire.introduction && (
                <MenuListItem>
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
                    icon={IntroductionIcon}
                    errorCount={
                      questionnaire.introduction.validationErrorInfo.totalCount
                    }
                    unreadComment={hasUnreadComments(
                      questionnaire?.introduction?.comments,
                      me.id
                    )}
                  />
                </MenuListItem>
              )}
            </NavList>
            <DragDropContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <Droppable droppableId={`root`} type={`sections`}>
                {(
                  { innerRef, placeholder, droppableProps },
                  { isDraggingOver }
                ) => (
                  <NavList
                    ref={innerRef}
                    isDraggingOver={isDraggingOver}
                    {...droppableProps}
                  >
                    {questionnaire.sections.map(
                      ({ id, repeatingSection, ...rest }) => (
                        <Section
                          key={`section-${id}`}
                          id={id}
                          questionnaireId={questionnaire.id}
                          open={openSections}
                          entity={entity}
                          repeatingSection={repeatingSection}
                          {...rest}
                        />
                      )
                    )}
                    {placeholder}
                  </NavList>
                )}
              </Droppable>
            </DragDropContext>
            <NavList>
              {questionnaire.submission && (
                <MenuListItem>
                  <BorderedNavItem
                    key={"submission"}
                    title="Submission page"
                    titleUrl={buildSubmissionPath({
                      questionnaireId: questionnaire.id,
                      submissionId: questionnaire.submission.id,
                      tab,
                    })}
                    disabled={isCurrentPage(
                      questionnaire.submission.id,
                      entityId
                    )}
                    icon={SubmissionIcon}
                    errorCount={
                      questionnaire.submission.validationErrorInfo.totalCount
                    }
                    unreadComment={hasUnreadComments(
                      questionnaire?.submission?.comments,
                      me.id
                    )}
                  />
                </MenuListItem>
              )}
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
