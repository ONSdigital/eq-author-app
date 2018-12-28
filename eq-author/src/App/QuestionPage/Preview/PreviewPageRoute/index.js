import PropTypes from "prop-types";
import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import styled from "styled-components";

import EditorLayout from "App/QuestionPage/Design/EditorLayout";
import IconText from "components/IconText";
import Loading from "components/Loading";
import Error from "App/QuestionPage/Preview/Error/Error";
import QuestionPageEditor from "App/QuestionPage/Design/QuestionPageEditor";

import { Answer } from "App/QuestionPage/Preview/PreviewPageRoute/answers";
import IconInfo from "App/QuestionPage/Preview/PreviewPageRoute/icon-info.svg?inline";

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
    background-color: #e0e0e0;
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.4em;
  margin: 0 0 1em;
`;

const Description = styled.div`
  margin-bottom: 1em;
`;

const Guidance = styled.div`
  margin-bottom: 2em;
`;

const Panel = styled.div`
  border-left: 10px solid #033e58;
  background: #eff0f9;
  padding: 1em;
`;

const Answers = styled.div`
  margin-bottom: 1em;
`;

export const UnwrappedPreviewPageRoute = ({ loading, data }) => {
  if (loading) {
    return <Loading height="38rem">Preview loading…</Loading>;
  }

  /*  eslint-disable react/no-danger */
  const { questionPage } = data;
  const { description, guidance, answers } = questionPage;

  let title = questionPage.title.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");

  return (
    <EditorLayout page={questionPage} preview routing>
      <Container>
        <PageTitle>
          {title ? (
            <div dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            <Error data-test="no-title" large>
              Missing Page Title
            </Error>
          )}
        </PageTitle>

        {description && (
          <Description
            data-test="description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {guidance && (
          <Guidance data-test="guidance">
            <Panel dangerouslySetInnerHTML={{ __html: guidance }} />
          </Guidance>
        )}
        {answers.length ? (
          <Answers>
            {answers.map(answer => (
              <Answer key={answer.id} answer={answer} />
            ))}
          </Answers>
        ) : (
          <Error data-test="no-answers" large>
            <IconText icon={IconInfo}>
              No answers have been added to this question.
            </IconText>
          </Error>
        )}
      </Container>
    </EditorLayout>
  );
};

UnwrappedPreviewPageRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    questionPage: propType(QuestionPageEditor.fragments.QuestionPage).isRequired
  })
};

export const QUESTION_PAGE_QUERY = gql`
  query GetQuestionPage($id: ID!) {
    questionPage(id: $id) {
      ...QuestionPage
    }
  }

  ${QuestionPageEditor.fragments.QuestionPage}
`;

export default withApollo(props => (
  <Query
    query={QUESTION_PAGE_QUERY}
    variables={{ id: props.match.params.pageId }}
  >
    {innerProps => <UnwrappedPreviewPageRoute {...innerProps} {...props} />}
  </Query>
));
