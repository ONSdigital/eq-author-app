import React from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import styled from "styled-components";

import { buildSectionPath } from "utils/UrlUtils";

import IconSection from "assets/icon-section.svg?inline";

import CollapsibleNavItem from "components/CollapsibleNavItem";
import Page from "../Page";
import Folder from "../Folder";

import { dnd, dndCSS } from "../dragDropFunctions/dragAndDrop";

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  ${dndCSS}
`;

const Section = ({
  id: sectionId,
  questionnaireId,
  displayName,
  folders,
  validationErrorInfo,
  open,
  position,
  handleMoveContent,
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
          handleMoveContent={handleMoveContent}
          {...rest}
        />
      );
    } else {
      return pages.map(({ id: pageId, ...rest }) => (
        <Page
          key={`page-${pageId}`}
          id={pageId}
          questionnaireId={questionnaireId}
          handleMoveContent={handleMoveContent}
          dragContext="SectionPage"
          {...rest}
          position={position}
        />
      ));
    }
  };

  return (
    <ListItem
      draggable="true"
      onDragStart={dnd.handleDragStart}
      onDragOver={dnd.handleDragOver}
      onDrop={dnd.handleDrop(handleMoveContent)}
      onDragEnter={dnd.handleDragEnter}
      onDragLeave={dnd.handleDragLeave}
      id={sectionId}
      data-drag-context="Section"
      data-drag-position={position}
    >
      <CollapsibleNavItem
        title={displayName}
        icon={IconSection}
        bordered
        open={open}
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
        <NavList>{folders.map((folder) => renderChild(folder))}</NavList>
      </CollapsibleNavItem>
    </ListItem>
  );
};

Section.propTypes = {
  id: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  folders: PropTypes.array.isRequired, // eslint-disable-line
  validationErrorInfo: PropTypes.object.isRequired, // eslint-disable-line
  open: PropTypes.bool,
  handleMoveContent: PropTypes.func,
  position: PropTypes.number,
};

export default Section;
