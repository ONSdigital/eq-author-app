import React from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

import { buildFolderPath } from "utils/UrlUtils";

import IconFolder from "assets/icon-folder.svg?inline";

import { Droppable, Draggable } from "react-beautiful-dnd";
import CollapsibleNavItem from "components/CollapsibleNavItem";
import Page from "../Page";

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ isDraggingOver }) =>
    isDraggingOver && `background-color: ${colors.darkerBlack};`}
`;

const FolderNavItem = styled(CollapsibleNavItem)`
  ${({ isDragging }) => isDragging && focusStyle}
  ${({ isDragging }) =>
    isDragging &&
    `
    * {
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
  `}
`;

const ListItem = styled.li``;

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
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <ListItem ref={innerRef} {...draggableProps} {...dragHandleProps}>
          <FolderNavItem
            title={displayName}
            open
            icon={IconFolder}
            disabled={isCurrentFolder(folderId, entityId)}
            titleUrl={buildFolderPath({
              questionnaireId,
              folderId,
              tab,
            })}
            selfErrorCount={validationErrorInfo.totalCount}
            childErrorCount={calculatePageErrors(pages)}
            isDragging={isDragging}
          >
            <Droppable
              droppableId={folderId}
              type={`folder-${folderId}-content`}
            >
              {(
                { innerRef, placeholder, droppableProps },
                { isDraggingOver }
              ) => (
                <NavList
                  ref={innerRef}
                  isDraggingOver={isDraggingOver}
                  {...droppableProps}
                >
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
          </FolderNavItem>
        </ListItem>
      )}
    </Draggable>
  );
};

Folder.propTypes = {
  id: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired, // eslint-disable-line
  validationErrorInfo: PropTypes.object.isRequired, // eslint-disable-line
  position: PropTypes.number.isRequired,
};

export default Folder;
