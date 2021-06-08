import React from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

import { buildPagePath, buildConfirmationPath } from "utils/UrlUtils";

import IconQuestionPage from "assets/icon-questionpage.svg?inline";
import IconConfirmationPage from "assets/icon-playback.svg?inline";
import IconSummaryPage from "assets/icon-summarypage.svg?inline";

import { Draggable } from "react-beautiful-dnd";
import NavItem from "components/NavItem";

const ListItem = styled.li``;

const Page = ({
  id: pageId,
  questionnaireId,
  displayName,
  pageType,
  confirmation,
  validationErrorInfo,
  position,
}) => {
  const { entityId, tab = "design" } = useParams();

  const isCurrentPage = (navItemId, currentPageId) =>
    navItemId === currentPageId;

  const iconMap = {
    QuestionPage: IconQuestionPage,
    CalculatedSummaryPage: IconSummaryPage,
  };

  return (
    <Draggable key={pageId} draggableId={pageId} index={position}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <ListItem ref={innerRef} {...draggableProps}>
          <NavItem
            title={displayName}
            icon={iconMap[pageType]}
            disabled={isCurrentPage(pageId, entityId)}
            titleUrl={buildPagePath({
              questionnaireId,
              pageId,
              tab,
            })}
            errorCount={validationErrorInfo?.totalCount}
            isDragging={isDragging}
            {...dragHandleProps}
          />
          {confirmation && (
            <NavItem
              key={confirmation.displayName}
              title={confirmation.displayName}
              titleUrl={buildConfirmationPath({
                questionnaireId,
                confirmationId: confirmation.id,
                tab,
              })}
              disabled={isCurrentPage(confirmation.id, entityId)}
              icon={IconConfirmationPage}
              errorCount={confirmation?.validationErrorInfo?.totalCount}
              {...dragHandleProps}
            />
          )}
        </ListItem>
      )}
    </Draggable>
  );
};

export default Page;
