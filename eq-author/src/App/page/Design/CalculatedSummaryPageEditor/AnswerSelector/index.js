import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { colors } from "constants/theme";

import Answers from "./Answers";

const Container = styled.div`
  border: 1px solid ${colors.grey};
  border-radius: 3px;
  padding: 1em;
  margin-bottom: 2em;
`;

const renderContent = (
  hasSummaryAnswers,
  page,
  onUpdateCalculatedSummaryPage
) =>
  hasSummaryAnswers ? (
    <Answers
      page={page}
      onUpdateCalculatedSummaryPage={onUpdateCalculatedSummaryPage}
    />
  ) : (
    <p>Hi</p>
  );
const AnswerSelector = ({ page, onUpdateCalculatedSummaryPage }) => {
  return (
    <Container>
      {renderContent(
        page.summaryAnswers.length > 0,
        page,
        onUpdateCalculatedSummaryPage
      )}
    </Container>
  );
};

AnswerSelector.fragments = {
  AnswerSelector: gql`
    fragment AnswerSelector on CalculatedSummaryPage {
      id
      section {
        id
        displayName
      }
      summaryAnswers {
        id
        displayName
        type
        properties
      }
    }
  `,
};

export default AnswerSelector;
