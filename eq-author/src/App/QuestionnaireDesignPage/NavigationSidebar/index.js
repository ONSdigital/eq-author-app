import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import { buildIntroductionPath } from "utils/UrlUtils";
import onDragEnd from "./dragDropFunctions/onDragEnd";

import { DragDropContext } from "react-beautiful-dnd";
import NavigationHeader from "./NavigationHeader";
import NavItem from "components/NavItem";
import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";

import Section from "./Section";

import PageIcon from "assets/icon-survey-intro.svg?inline";

import MOVE_PAGE_MUTATION from "graphql/movePage.graphql";
import MOVE_FOLDER_MUTATION from "graphql/moveFolder.graphql";

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

  const handleDragEnd = ({ destination, source, draggableId }) =>
    onDragEnd(
      questionnaire,
      destination,
      source,
      draggableId,
      movePage,
      moveFolder
    );

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
              <DragDropContext onDragEnd={handleDragEnd}>
                {questionnaire.sections.map(({ id, ...rest }) => (
                  <Section
                    key={`section-${id}`}
                    id={id}
                    questionnaireId={questionnaire.id}
                    open={openSections}
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
