import React from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import styled from "styled-components";

import { buildFolderPath } from "utils/UrlUtils";

import IconFolder from "assets/icon-folder.svg?inline";

import CollapsibleNavItem from "components/CollapsibleNavItem";
import Page from "../Page";
import { dnd, dndCSS } from "../dragDropFunctions/dragAndDrop";

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FolderNavItem = styled(CollapsibleNavItem)``;

const ListItem = styled.li`
  ${dndCSS}
`;

const Folder = ({
  id: folderId,
  questionnaireId,
  displayName,
  pages,
  validationErrorInfo,
  position,
  handleMoveContent,
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
    <ListItem
      draggable="true"
      onDragStart={dnd.handleDragStart}
      onDragOver={dnd.handleDragOver}
      onDrop={dnd.handleDrop(handleMoveContent)}
      onDragEnter={dnd.handleDragEnter}
      onDragLeave={dnd.handleDragLeave}
      id={folderId}
      data-drag-context="Folder"
      data-drag-position={position}
    >
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
      >
        <NavList>
          {pages.map(({ id: pageId, ...rest }) => (
            <Page
              key={`page-${pageId}`}
              id={pageId}
              questionnaireId={questionnaireId}
              handleMoveContent={handleMoveContent}
              dragContext="FolderPage"
              {...rest}
            />
          ))}
        </NavList>
      </FolderNavItem>
    </ListItem>
  );
};

Folder.propTypes = {
  id: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired, // eslint-disable-line
  validationErrorInfo: PropTypes.object.isRequired, // eslint-disable-line
  position: PropTypes.number.isRequired,
  handleMoveContent: PropTypes.func,
};

export default Folder;
