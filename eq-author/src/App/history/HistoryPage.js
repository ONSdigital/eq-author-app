import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";

import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
import Error from "components/Error";
import Loading from "components/Loading";
import HistoryItem from "./HistoryItem";
import Header from "components/EditorLayout/Header";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import RichTextEditor from "components/RichTextEditor";
import ScrollPane from "components/ScrollPane";

import CREATE_NOTE from "./createHistoryNoteMutation.graphql";
import questionnaireHistoryQuery from "./questionnaireHistory.graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  border: 1px solid ${colors.lightGrey};
  margin: 0.5em 1em;
`;

const ItemGrid = styled(StyledGrid)`
  flex: 1 1 auto;
  margin-bottom: 2em;
  overflow: hidden;
`;

const RTEWrapper = styled.div`
  margin-bottom: 0.5em;
`;

const StyledScrollPane = styled(ScrollPane)`
  div:first-of-type {
    span:first-of-type {
      margin-top: 0;
    }
  }
  div:last-of-type {
    margin-bottom: 0;
  }
`;

const ActionButtons = styled(ButtonGroup)`
  flex: 0 0 auto;
`;

export const HistoryPageContent = ({ match }) => {
  const { loading, error, data } = useQuery(questionnaireHistoryQuery, {
    variables: { input: { questionnaireId: match.params.questionnaireId } },
    fetchPolicy: "network-only",
  });
  const [addNote] = useMutation(CREATE_NOTE, {
    update(
      cache,
      {
        data: { createHistoryNote },
      }
    ) {
      cache.writeQuery({
        query: questionnaireHistoryQuery,
        variables: {
          input: { questionnaireId: match.params.questionnaireId },
        },
        data: { history: createHistoryNote },
      });
    },
  });

  const [noteState, setNoteState] = useState({ name: "note", value: "" });
  if (loading) {
    return <Loading height="100%">Questionnaire history loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }
  const { history } = data;

  return (
    <Container>
      <Header title="History" />
      <StyledScrollPane>
        <StyledGrid>
          <RTEWrapper>
            <RichTextEditor
              id={`add-note-textbox`}
              name="note"
              label="Add note"
              onUpdate={setNoteState}
              value={noteState.value}
              controls={{
                emphasis: true,
                list: true,
                bold: true,
              }}
              multiline
            />
          </RTEWrapper>
          <ActionButtons horizontal align="right">
            <Button
              data-test="add-note-btn"
              onClick={() => {
                if (!noteState.value) {
                  return;
                }
                setNoteState({ name: "note", value: "" });
                addNote({
                  variables: {
                    input: {
                      id: match.params.questionnaireId,
                      bodyText: noteState.value,
                    },
                  },
                });
              }}
            >
              Add note
            </Button>
          </ActionButtons>
        </StyledGrid>
        <ItemGrid>
          {history.map(
            ({
              id,
              publishStatus,
              questionnaireTitle,
              bodyText,
              user,
              time,
            }) => (
              <HistoryItem
                key={id}
                questionnaireTitle={questionnaireTitle}
                publishStatus={publishStatus}
                userName={user.displayName}
                bodyText={bodyText}
                createdAt={time}
              />
            )
          )}
        </ItemGrid>
      </StyledScrollPane>
    </Container>
  );
};

HistoryPageContent.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default HistoryPageContent;
