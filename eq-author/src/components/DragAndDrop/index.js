import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CollapsibleNavItem from "components/CollapsibleNavItem";
import NavItem from "components/NavItem";

import { ReactComponent as IconSection } from "assets/icon-section.svg";
import { ReactComponent as IconQuestionPage } from "assets/icon-questionpage.svg";
import { ReactComponent as PageIcon } from "assets/icon-survey-intro.svg";

const Panel = styled.div`
  background: #333333;
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

const Page = ({ id, index, title }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <ListItem {...provided.draggableProps} ref={provided.innerRef}>
          <NavItem
            title={title}
            icon={IconQuestionPage}
            {...provided.dragHandleProps}
          />
        </ListItem>
      )}
    </Draggable>
  );
};

const Section = ({ id, title, pages }) => {
  return (
    <CollapsibleNavItem title={title} icon={IconSection} defaultOpen bordered>
      <Droppable droppableId={id}>
        {(provided) => (
          <NavList ref={provided.innerRef} {...provided.droppableProps}>
            {pages.map(({ id, ...rest }, index) => (
              <Page key={id} id={id} {...rest} index={index} />
            ))}
            {provided.placeholder}
          </NavList>
        )}
      </Droppable>
    </CollapsibleNavItem>
  );
};

const DragAndDrop = (props) => {
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
    <Panel>
      <NavList>
        <IntroductionListItem>
          <NavItem key={"introduction"} title="Introduction" icon={PageIcon} />
        </IntroductionListItem>
      </NavList>
      <DragDropContext onDragEnd={onDragEnd}>
        {sections.map(({ id, ...rest }) => {
          return <Section key={id} id={id} {...rest} />;
        })}
      </DragDropContext>
    </Panel>
  );
};

export default DragAndDrop;
