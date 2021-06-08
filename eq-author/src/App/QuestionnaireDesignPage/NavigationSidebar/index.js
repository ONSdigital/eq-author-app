import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import { buildIntroductionPath } from "utils/UrlUtils";

import {
  getPageById,
  getFolderById,
  getSectionById,
  getSectionByFolderId,
} from "utils/questionnaireUtils";

import { DragDropContext } from "react-beautiful-dnd";
import NavigationHeader from "./NavigationHeader";
import NavItem from "components/NavItem";
import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";

import Section from "./Section";

import PageIcon from "assets/icon-survey-intro.svg?inline";

import MOVE_PAGE_MUTATION from "graphql/movePage.graphql";
import MOVE_FOLDER_MUTATION from "App/folder/graphql/moveFolder.graphql";

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

const NavigationSidebar = ({ questionnaire }) => {
  const { entityId, tab = "design" } = useParams();
  const [openSections, toggleSections] = useState(true);

  const [movePage] = useMutation(MOVE_PAGE_MUTATION);
  const [moveFolder] = useMutation(MOVE_FOLDER_MUTATION);

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

    const pageBeingMoved = getPageById(questionnaire, draggableId);
    const folderBeingMoved = getFolderById(questionnaire, draggableId);

    const destinationSection = getSectionById(
      questionnaire,
      destination.droppableId
    );

    const destinationFolder = getFolderById(
      questionnaire,
      destination.droppableId
    );

    // If the user is moving a folder into a folder
    if (folderBeingMoved && destinationFolder) {
      return;
    }

    //If the user is moving a page into a folder
    if (pageBeingMoved && destinationFolder) {
      const { id } = pageBeingMoved;
      const { id: folderId } = destinationFolder;
      const { id: sectionId } = getSectionByFolderId(questionnaire, folderId);
      const { index: position } = destination;

      movePage({
        variables: {
          input: {
            id,
            sectionId,
            folderId,
            position,
          },
        },
      });
    }

    // If the user is moving a page into a section
    if (pageBeingMoved && destinationSection) {
      const { id } = pageBeingMoved;
      const { id: sectionId } = destinationSection;
      const { index: position } = destination;

      movePage({
        variables: {
          input: {
            id,
            sectionId,
            position,
          },
        },
      });
    }

    // If the user is moving a folder into a section
    if (folderBeingMoved && destinationSection) {
      const { id } = folderBeingMoved;
      const { id: sectionId } = destinationSection;
      const { index: position } = destination;

      moveFolder({
        variables: {
          input: {
            id,
            sectionId,
            position,
          },
        },
      });
    }
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
