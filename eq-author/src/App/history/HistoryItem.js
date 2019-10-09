import React from "react";
import styled from "styled-components";
import moment from "moment";
import { colors } from "constants/theme";
import PropTypes from "prop-types";

const StyledItem = styled.span`
  display: inline-block;
  padding: 0 1em 0 0;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  width: 100%;
`;

const QuestionnaireTitle = styled.div`
  padding: 1em;
  color: ${colors.black};
  float: left;
`;

const QuestionnaireUserName = styled.div`
  padding: 1em;
  color: ${colors.black};
  float: right;
`;

const formatDate = unformattedDate =>
  moment(unformattedDate).format("DD/MM/YYYY [at] HH:mm");

const HistoryItem = ({ questionnaireTitle, userName, createdAt }) => {
  return (
    <StyledItem>
      <QuestionnaireTitle>
        {questionnaireTitle} - <strong>Questionnaire created</strong>
      </QuestionnaireTitle>
      <QuestionnaireUserName>
        {userName} - {formatDate(createdAt)}
      </QuestionnaireUserName>
    </StyledItem>
  );
};

HistoryItem.propTypes = {
  questionnaireTitle: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};

export default HistoryItem;
