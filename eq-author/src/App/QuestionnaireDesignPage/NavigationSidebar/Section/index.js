import React from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import styled from "styled-components";
import { colors } from "constants/theme";
import { useMe } from "App/MeContext";

import { buildSectionPath } from "utils/UrlUtils";
import hasUnreadComments from "utils/hasUnreadComments";

import IconSection from "assets/icon-section.svg?inline";

import { Draggable, Droppable } from "react-beautiful-dnd";
import CollapsibleNavItem from "components/CollapsibleNavItem";
import Folder from "../Folder";

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

const Section = ({
  id: sectionId,
  questionnaireId,
  displayName,
  folders,
  validationErrorInfo,
  open,
  position,
  comments,
}) => {
  const { me } = useMe();
  const { entityId, tab = "design" } = useParams();

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const calculatePageErrors = (pages) =>
    pages.reduce(
      (acc, { validationErrorInfo }) => (acc += validationErrorInfo.totalCount),
      0
    );
  const allPagesInSection = folders.flatMap(({ pages }) => pages);

  return (
    <Draggable key={sectionId} draggableId={sectionId} index={position}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <ListItem ref={innerRef} {...draggableProps} {...dragHandleProps}>
          <CollapsibleNavItem
            title={displayName}
            icon={IconSection}
            bordered
            open={open}
            isDragging={isDragging}
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
            unreadComment={hasUnreadComments(comments, me.id)}
          >
            <Droppable droppableId={sectionId} type={`section-content`}>
              {(
                { innerRef, placeholder, droppableProps },
                { isDraggingOver }
              ) => (
                <NavList
                  ref={innerRef}
                  isDraggingOver={isDraggingOver}
                  {...droppableProps}
                >
                  {folders.map(
                    ({ id: folderId, pages, position, listId, ...rest }) => (
                      <Folder
                        key={`folder-${folderId}`}
                        id={folderId}
                        questionnaireId={questionnaireId}
                        pages={pages}
                        position={position}
                        listId={listId}
                        {...rest}
                      />
                    )
                  )}
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

Section.propTypes = {
  id: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  folders: PropTypes.array.isRequired, // eslint-disable-line
  validationErrorInfo: PropTypes.object.isRequired, // eslint-disable-line
  open: PropTypes.bool,
  position: PropTypes.number,
  comments: PropTypes.array, //eslint-disable-line
};

export default Section;
