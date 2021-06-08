import React from "react";

import { useParams } from "react-router-dom";
import styled from "styled-components";

import { buildFolderPath } from "utils/UrlUtils";

import IconFolder from "assets/icon-folder.svg?inline";

import { Droppable, Draggable } from "react-beautiful-dnd";
import CollapsibleNavItem from "components/CollapsibleNavItem";
import Page from "../Page";

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
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
          <CollapsibleNavItem
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
            <Droppable droppableId={folderId} type="folderContent">
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

export default Folder;
