import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { compact, isArray } from "lodash";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";

import EditorLayout from "components/EditorLayout";
import Editor from "App/questionConfirmation/Design/Editor";

import MultipleChoiceAnswer from "components/preview/Answers/MultipleChoiceAnswer";
import PageTitle from "components/preview/elements/PageTitle";
import MultipleChoiceAnswerOptionsReplay from "./MultipleChoiceAnswerOptionsReplay";

import { RADIO } from "constants/answer-types";
import { colors } from "constants/theme";
import Panel from "components/Panel";
import CommentsPanel from "App/Comments";

import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";

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
    background-color: #dce5b0;
    padding: 0 0.125em;
    font-style: normal;
  }
  span[data-piped] {
    background-color: #5f7682;
    border-radius: 4px;
    white-space: pre-wrap;
    color: white;
    padding: 0.1em 0.4em 0.2em;
  }
`;

const Replay = styled.div`
  background-color: ${colors.darkBlue};
  color: ${colors.white};
  min-width: 20em;
  width: 100%;
  word-break: break-word;
  display: inline-block;
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 1em;
  padding-right: 1em;
`;

export const UnwrappedPreviewConfirmationRoute = ({ loading, data }) => {
  if (loading) {
    return <Loading height="38rem">Preview loading…</Loading>;
  }

  const {
    questionConfirmation: {
      id,
      title,
      negative,
      positive,
      displayName,
      page: { answers },
    },
  } = data;

  const { questionConfirmation } = data;
  const { comments } = questionConfirmation;
  const pageTitle = title && title.replace(/[[\]]/g, "");

  return (
    <EditorLayout
      preview
      logic
      title={displayName}
      renderPanel={() => <CommentsPanel comments={comments} componentId={id} />}
      validationErrorInfo={questionConfirmation.validationErrorInfo}
      comments={comments}
    >
      <Panel>
        <Container>
          <PageTitle title={pageTitle} />
          {answers.map(
            ({ id, options, mutuallyExclusiveOption }) =>
              isArray(options) && (
                <Replay key={id}>
                  <MultipleChoiceAnswerOptionsReplay
                    options={compact([...options, mutuallyExclusiveOption])}
                  />
                </Replay>
              )
          )}
          {
            <MultipleChoiceAnswer
              answer={{ type: RADIO, options: [positive, negative] }}
            />
          }
        </Container>
      </Panel>
    </EditorLayout>
  );
};

UnwrappedPreviewConfirmationRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    questionConfirmation: propType(Editor.fragments.QuestionConfirmation),
  }),
};

const CONFIRMATION_QUERY = gql`
  query getQuestionConfirmation($id: ID!) {
    questionConfirmation(id: $id) {
      ...QuestionConfirmation
      validationErrorInfo {
        ...ValidationErrorInfo
      }
      comments {
        ...Comment
      }
    }
  }

  ${CommentFragment}
  ${Editor.fragments.QuestionConfirmation}
  ${ValidationErrorInfoFragment}
`;

export default withApollo((props) => (
  <Query
    query={CONFIRMATION_QUERY}
    variables={{ id: props.match.params.confirmationId }}
  >
    {(innerProps) => (
      <UnwrappedPreviewConfirmationRoute {...innerProps} {...props} />
    )}
  </Query>
));
