import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";

import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
import Error from "components/Error";
import Loading from "components/Loading";
import HistoryItem from "./HistoryItem";
import Header from "components/EditorLayout/Header";
import questionnaireHistoryQuery from "./questionnaireHistory.graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 1em 2em;
  border: 1px solid ${colors.lightGrey};
  margin: 0.5em 1em;
`;

export const HistoryPageContent = ({ match }) => {
  const { loading, error, data } = useQuery(questionnaireHistoryQuery, {
    variables: { input: { questionnaireId: match.params.questionnaireId } },
  });

  if (loading) {
    return <Loading height="100%">Questionnaire history loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  const createdAt = data.questionnaire.createdAt;
  const userName = data.questionnaire.createdBy.displayName;
  const questionnaireTitle = data.questionnaire.title;

  return (
    <Container>
      <Header title="History" />

      <StyledGrid>
        <HistoryItem
          questionnaireTitle={questionnaireTitle}
          userName={userName}
          createdAt={createdAt}
        />
      </StyledGrid>
    </Container>
  );
};

HistoryPageContent.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default HistoryPageContent;
