import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { compact, isArray } from "lodash";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";

import EditorLayout from "App/QuestionPage/Design/EditorLayout";
import Editor from "App/QuestionConfirmation/Design/QuestionConfirmationRoute/Editor";

import MultipleChoiceAnswer from "App/components/Preview/Answers/MultipleChoiceAnswer";
import PageTitle from "App/components/Preview/Elements/PageTitle";
import MultipleChoiceAnswerOptionsReplay from "App/QuestionConfirmation/Preview/PreviewConfirmationRoute/MultipleChoiceAnswerOptionsReplay";

import { RADIO } from "constants/answer-types";
import { colors } from "constants/theme";

const Container = styled.div`
  padding: 2em;
  max-width: 40em;
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
    white-space: pre;
    color: white;
    padding: 0.2em 0.4em;
  }
`;

const Replay = styled.div`
  background-color: ${colors.darkBlue};
  color: ${colors.white};
  width: auto;
  min-width: 20em;
  display: inline-block;
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 2em;
`;

export const UnwrappedPreviewConfirmationRoute = ({ loading, data }) => {
  if (loading) {
    return <Loading height="38rem">Preview loading…</Loading>;
  }

  const {
    questionConfirmation,
    questionConfirmation: { title, negative, positive },
    questionConfirmation: {
      page: { answers }
    }
  } = data;

  const pageTitle = title && title.replace(/[[\]]/g, "");

  return (
    <EditorLayout page={questionConfirmation} preview>
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
    </EditorLayout>
  );
};

UnwrappedPreviewConfirmationRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    questionConfirmation: propType(Editor.fragments.QuestionConfirmation)
  })
};

const CONFIRMATION_QUERY = gql`
  query getQuestionConfirmation($id: ID!) {
    questionConfirmation(id: $id) {
      ...QuestionConfirmation
    }
  }

  ${Editor.fragments.QuestionConfirmation}
`;

export default withApollo(props => (
  <Query
    query={CONFIRMATION_QUERY}
    variables={{ id: props.match.params.confirmationId }}
  >
    {innerProps => (
      <UnwrappedPreviewConfirmationRoute {...innerProps} {...props} />
    )}
  </Query>
));
