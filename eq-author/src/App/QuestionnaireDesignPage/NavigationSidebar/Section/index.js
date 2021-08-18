import React from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import styled from "styled-components";
import { colors } from "constants/theme";

import { buildSectionPath } from "utils/UrlUtils";

import IconSection from "assets/icon-section.svg?inline";

import { Droppable } from "react-beautiful-dnd";
import CollapsibleNavItem from "components/CollapsibleNavItem";
import Page from "../Page";
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
          {...rest}
        />
      );
    } else {
      return pages.map(({ id: pageId, ...rest }) => (
        <Page
          key={`page-${pageId}`}
          id={pageId}
          questionnaireId={questionnaireId}
          {...rest}
          position={position}
        />
      ));
    }
  };

  return (
    <ListItem>
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
        <Droppable
          droppableId={sectionId}
          type={`section-${sectionId}-content`}
        >
          {({ innerRef, placeholder, droppableProps }, { isDraggingOver }) => (
            <NavList
              ref={innerRef}
              isDraggingOver={isDraggingOver}
              {...droppableProps}
            >
              {folders.map((folder) => renderChild(folder))}
              {placeholder}
            </NavList>
          )}
        </Droppable>
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
};

export default Section;
