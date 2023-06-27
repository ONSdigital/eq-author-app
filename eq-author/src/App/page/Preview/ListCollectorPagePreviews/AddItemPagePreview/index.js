import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import { useQuery } from "@apollo/react-hooks";

import CommentsPanel from "App/Comments";

import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import Loading from "components/Loading";
import Error from "components/Error";
import IconText from "components/IconText";

import Title from "components/preview/elements/PageTitle";
import { Answer } from "components/preview/Answers";
import EmptyAnswersError from "components/preview/Error";

import IconInfo from "assets/icon-missing-collection-list-answers.svg?inline";

import GET_COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";

const Container = styled.div`
  padding: 2em;
  font-size: 1.1em;
  p {
    margin: 0 0 1em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  em {
    background-color: ${colors.highlightGreen};
    padding: 0 0.125em;
    font-style: normal;
  }
  span[data-piped] {
    background-color: ${colors.pipingGrey};
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre-wrap;
  }
`;

const Answers = styled.div`
  margin-bottom: 1em;
`;

const AddItemPagePreview = ({ page }) => {
  const { id, title, displayName, folder, comments, validationErrorInfo } =
    page;

  const { data, loading, error } = useQuery(GET_COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <EditorLayout>
        <Loading height="100%">Questionnaire lists loading…</Loading>
      </EditorLayout>
    );
  }

  if (error) {
    return (
      <EditorLayout>
        <Error>Something went wrong</Error>
      </EditorLayout>
    );
  }

  let answers = [];
  const { lists } = data?.collectionLists;
  const selectedList = lists.find(({ id }) => id === folder.listId);

  if (selectedList != null) {
    answers = selectedList.answers;
  }

  return (
    <EditorLayout
      preview
      title={displayName}
      validationErrorInfo={validationErrorInfo}
      comments={comments}
      renderPanel={() => <CommentsPanel comments={comments} componentId={id} />}
    >
      <Panel>
        <Container>
          <Title title={title} />
          {answers.length ? (
            <Answers>
              {answers.map((answer) => (
                <Answer key={answer.id} answer={answer} />
              ))}
            </Answers>
          ) : (
            <EmptyAnswersError
              data-test="empty-collection-list-answers-error"
              large
            >
              <IconText icon={IconInfo}>
                {selectedList == null
                  ? "Collection list is not selected"
                  : "No answers have been added to this collection list"}
              </IconText>
            </EmptyAnswersError>
          )}
        </Container>
      </Panel>
    </EditorLayout>
  );
};

export default AddItemPagePreview;
