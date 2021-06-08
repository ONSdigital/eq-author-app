import React from "react";

import { useParams } from "react-router-dom";
import styled from "styled-components";

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
        <Droppable droppableId={sectionId} type="sectionContent">
          {({ innerRef, placeholder, droppableProps }) => (
            <NavList ref={innerRef} {...droppableProps}>
              {folders.map((folder) => renderChild(folder))}
              {placeholder}
            </NavList>
          )}
        </Droppable>
      </CollapsibleNavItem>
    </ListItem>
  );
};

export default Section;
