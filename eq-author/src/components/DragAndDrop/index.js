import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CollapsibleNavItem from "components/CollapsibleNavItem";
import NavItem from "components/NavItem";
import { colors } from "constants/theme";

import { ReactComponent as IconSection } from "assets/icon-section.svg";
import { ReactComponent as IconQuestionPage } from "assets/icon-questionpage.svg";
import { ReactComponent as PageIcon } from "assets/icon-survey-intro.svg";

const Panel = styled.div`
  background: ${colors.black};
  width: 40%;
  float: left;
  padding: 1em 0;
  overflow: hidden;
`;

const IntroductionListItem = styled.li`
  padding-left: 2.3em;
  margin-bottom: 0.5em;
  margin-top: 2px;

  span {
    font-weight: bold;
  }
`;

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li``;

const Page = ({ id, index, title, titleUrl }) => {
  return (
    <Draggable
      draggableId={id}
      index={index}
      key={id}
      disableInteractiveElementBlocking="true"
    >
      {(provided) => [
        <ListItem
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          key={id}
          ref={provided.innerRef}
        >
          <NavItem
            title={title}
            titleUrl={titleUrl}
            icon={IconQuestionPage}
            {...provided.dragHandleProps}
          />
        </ListItem>,
      ]}
    </Draggable>
  );
};

Page.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  titleUrl: PropTypes.string.isRequired,
};

const Section = ({ id, title, pages, titleUrl, index }) => {
  return (
    <CollapsibleNavItem
      title={title}
      titleUrl={titleUrl}
      icon={IconSection}
      defaultOpen
      bordered
    >
      <Droppable droppableId={id} index={index}>
        {({ innerRef, placeholder, droppableProps }) => (
          <NavList ref={innerRef} {...droppableProps}>
            {pages.map(({ id, ...rest }, index) => (
              <Page key={id} id={id} index={index} {...rest} />
            ))}
            {placeholder}
          </NavList>
        )}
      </Droppable>
    </CollapsibleNavItem>
  );
};

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  titleUrl: PropTypes.string.isRequired,
  index: PropTypes.number,
};

const DragAndDrop = (props) => {
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  const [sections, updateSections] = useState([]);

  useEffect(() => {
    updateSections(props.sections);
  }, [props.sections]);

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

    // Move stuff around -- in the real version, this would be replaced with the mutation that calls the DB.
    const section = sections.find(({ id }) => id === source.droppableId);
    const sectionIndex = sections.indexOf(section);
    const pages = Array.from(section.pages);
    const pageToMove = { ...pages.find(({ id }) => id === draggableId) };

    pages.splice(source.index, 1);
    pages.splice(destination.index, 0, pageToMove);

    const updatedSection = { ...section, pages };

    const updatedSectionsArr = [...sections];
    updatedSectionsArr[sectionIndex] = { ...updatedSection };

    updateSections(updatedSectionsArr);
  };

  return (
    <>
      {winReady && (
        <Panel>
          <NavList>
            <IntroductionListItem>
              <NavItem
                key={"introduction"}
                title="Introduction"
                titleUrl={"titleUrl"}
                icon={PageIcon}
              />
            </IntroductionListItem>
          </NavList>
          <DragDropContext onDragEnd={onDragEnd}>
            {sections.map(({ id, ...rest }, index) => {
              return <Section key={id} id={id} index={index} {...rest} />;
            })}
          </DragDropContext>
        </Panel>
      )}
    </>
  );
};

DragAndDrop.propTypes = {
  sections: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default DragAndDrop;
