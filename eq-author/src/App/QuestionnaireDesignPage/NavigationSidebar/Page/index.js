import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { buildPagePath, buildConfirmationPath } from "utils/UrlUtils";
import IconQuestionPage from "assets/icon-questionpage.svg?inline";
import IconConfirmationPage from "assets/icon-playback.svg?inline";
import IconSummaryPage from "assets/icon-summarypage.svg?inline";
import NavItem from "components/NavItem";
import { dnd, dndCSS } from "../dragDropFunctions/dragAndDrop";

const ListItem = styled.li`
  ${dndCSS}
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
  handleMoveContent,
}) => {
  const { tab = "design" } = useParams();

  const iconMap = {
    QuestionPage: IconQuestionPage,
    CalculatedSummaryPage: IconSummaryPage,
  };

  return (
    <ListItem
      draggable="true"
      onDragStart={dnd.handleDragStart}
      onDragOver={dnd.handleDragOver}
      onDrop={dnd.handleDrop(handleMoveContent)}
      onDragEnter={dnd.handleDragEnter}
      onDragLeave={dnd.handleDragLeave}
      id={pageId}
    >
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
        />
      )}
    </ListItem>
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
  handleMoveContent: PropTypes.func,
};

export default Page;
