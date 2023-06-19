import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import styled from "styled-components";
import { focusStyle } from "constants/theme";

import { buildPagePath, buildConfirmationPath } from "utils/UrlUtils";

import IconQuestionPage from "assets/icon-questionpage.svg?inline";
import IconConfirmationPage from "assets/icon-playback.svg?inline";
import IconSummaryPage from "assets/icon-summarypage.svg?inline";
import IconListCollectorPage from "assets/icon-list-collector.svg?inline";

import { Draggable } from "react-beautiful-dnd";
import NavItem from "components/NavItem";

import { useMe } from "App/MeContext";
import hasUnreadComments from "utils/hasUnreadComments";

const ListItem = styled.li`
  ${({ isDragging }) => isDragging && focusStyle}
  ${({ isDragging }) =>
    isDragging &&
    `
    *, &~* * {
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }`}
`;

const QuestionPage = styled(NavItem)``;
const ConfirmationPage = styled(NavItem)``;

const Page = ({
  id: pageId,
  questionnaireId,
  displayName,
  pageType,
  confirmation,
  validationErrorInfo,
  position,
  comments,
}) => {
  const { me } = useMe();
  const { tab = "design" } = useParams();

  const iconMap = {
    QuestionPage: IconQuestionPage,
    CalculatedSummaryPage: IconSummaryPage,
    ListCollectorPage: IconListCollectorPage,
    ListCollectorQualifierPage: IconQuestionPage,
    ListCollectorAddItemPage: IconQuestionPage,
    ListCollectorConfirmationPage: IconQuestionPage,
  };

  return (
    <Draggable key={pageId} draggableId={pageId} index={position}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <ListItem ref={innerRef} {...draggableProps} isDragging={isDragging}>
          <QuestionPage
            title={displayName}
            icon={iconMap[pageType]}
            titleUrl={buildPagePath({
              questionnaireId,
              pageId,
              tab,
            })}
            errorCount={validationErrorInfo?.totalCount}
            hasConfirmation={Boolean(confirmation)}
            dragHandleProps={dragHandleProps}
            unreadComment={hasUnreadComments(comments, me.id)}
          />
          {confirmation && (
            <ConfirmationPage
              title={confirmation.displayName}
              icon={IconConfirmationPage}
              titleUrl={buildConfirmationPath({
                questionnaireId,
                confirmationId: confirmation.id,
                tab,
              })}
              errorCount={confirmation?.validationErrorInfo?.totalCount}
              dragHandleProps={dragHandleProps}
              unreadComment={hasUnreadComments(confirmation?.comments, me.id)}
            />
          )}
        </ListItem>
      )}
    </Draggable>
  );
};

Page.propTypes = {
  id: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
  confirmation: PropTypes.object, // eslint-disable-line
  validationErrorInfo: PropTypes.object.isRequired, // eslint-disable-line
  position: PropTypes.number.isRequired,
  comments: PropTypes.array, //eslint-disable-line
};

export default Page;
