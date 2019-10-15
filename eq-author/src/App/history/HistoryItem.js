import React from "react";
import styled from "styled-components";
import moment from "moment";
import { colors } from "constants/theme";
import PropTypes from "prop-types";

const StyledItem = styled.span`
  display: flex;
  flex-wrap: wrap;
  padding: 0 1em 0 0;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  width: 100%;
  margin: 0.5em 1em 0 0;
  justify-content: space-between;
`;

const QuestionnaireTitle = styled.div`
  padding: 1em;
  color: ${colors.black};
`;

const QuestionnaireUserName = styled.div`
  padding: 1em;
  color: ${colors.black};
`;

const BreakLine = styled.div`
  flex-basis: 100%;
  height: 0;
`;
const EventText = styled.div`
  padding: 0 1em 0.5em;
  p {
    margin: 0 0 1em;
    word-break: break-all;
  }
`;

const formatDate = unformattedDate =>
  moment(unformattedDate).format("DD/MM/YYYY [at] HH:mm");

const HistoryItem = ({
  questionnaireTitle,
  publishStatus,
  userName,
  bodyText,
  createdAt,
}) => {
  return (
    <StyledItem>
      <QuestionnaireTitle>
        {questionnaireTitle} - <strong>{publishStatus}</strong>
      </QuestionnaireTitle>
      <QuestionnaireUserName>
        {userName} - {formatDate(createdAt)}
      </QuestionnaireUserName>
      <BreakLine />
      {bodyText && <EventText dangerouslySetInnerHTML={{ __html: bodyText }} />}
    </StyledItem>
  );
};

HistoryItem.propTypes = {
  questionnaireTitle: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  publishStatus: PropTypes.string.isRequired,
  bodyText: PropTypes.string,
};

export default HistoryItem;
