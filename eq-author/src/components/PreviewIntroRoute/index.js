import PropTypes from "prop-types";
import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";

import styled from "styled-components";
import { connect } from "react-redux";
import { flowRight, merge } from "lodash";
import { withRouter } from "react-router-dom";
import EditorLayout from "App/questionPage/Design/EditorLayout/index.js";

import Loading from "components/Loading";
import Error from "components/preview/Error";

import { getIntro } from "redux/questionnaireIntro/reducer";

import iconChevron from "./icon-chevron.svg";
import { colors } from "constants/theme";
import { changeField } from "redux/questionnaireIntro/actions";

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

const H1 = styled.h1`
  font-size: 1.5em;
  margin: 0 0 1rem;
`;

const H2 = styled.h2`
  font-size: 1.2em;
  margin: 0 0 0.2rem;
`;

const Description = styled.div`
  margin-bottom: 1rem;

  li {
    margin-bottom: 0.3em;
  }
`;

const Button = styled.div`
  color: white;
  background-color: #0f8243;
  border: 2px solid #0f8243;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 18px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 3px;
  display: inline-block;
  text-rendering: optimizeLegibility;
  margin-bottom: 2em;
`;

const Details = styled.div`
  margin-bottom: 1em;
`;

const DetailsTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.primary};
  margin-bottom: 0.5em;
  &::before {
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-left: -10px;
    content: url(${iconChevron});
    transform: rotate(90deg);
  }
`;

const DetailsContent = styled.div`
  border-left: 2px solid #999999;
  margin-left: 6px;
  padding: 0.2em 0 0.2em 1em;
`;

/*  eslint-disable react/no-danger */
const PageTitle = ({ children, missingText = "Missing page title" }) => (
  <H1>
    {children ? (
      <div dangerouslySetInnerHTML={{ __html: children }} />
    ) : (
      <Error data-test="no-title" large>
        {missingText}
      </Error>
    )}
  </H1>
);

export const UnwrappedPreviewIntroRoute = ({
  loading,
  data,
  intro,
  changeField
}) => {
  if (loading) {
    return <Loading height="38rem">Preview loading…</Loading>;
  }

  const { questionPage } = data;
  const {
    title,
    description,
    legal,
    secondaryTitle,
    secondaryDescription,
    details,
    tertiaryTitle,
    tertiaryDescription
  } = intro;

  return (
    <EditorLayout
      page={questionPage}
      intro={intro}
      changeField={changeField}
      preview
      routing={false}
    >
      <Container>
        <PageTitle missingText="Missing introduction title">{title}</PageTitle>
        <Description
          data-test="description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {legal === "notice-1" && (
          <Description>
            <H2>Your response is legally required</H2>
            <p>
              Notice is given under section 1 of the Statistics of Trade Act
              1947.
            </p>
          </Description>
        )}
        {legal === "notice-2" && (
          <Description>
            <H2>Your response is legally required</H2>
            <p>
              Notice is given under section 3 and 4 of the Statistics of Trade
              Act 1947.
            </p>
          </Description>
        )}
        <Button>Start survey</Button>
        <PageTitle missingText="Missing secondary title">
          {secondaryTitle}
        </PageTitle>
        <Description
          dangerouslySetInnerHTML={{ __html: secondaryDescription }}
        />
        {details.length > 0 &&
          details.map((detail, index) => (
            <Details key={index}>
              {detail.title === "" ? (
                <Error small style={{ marginBottom: "0.5em" }}>
                  Missing collapsible title
                </Error>
              ) : (
                <DetailsTitle
                  dangerouslySetInnerHTML={{
                    __html: detail.title
                  }}
                />
              )}

              <DetailsContent>
                {detail.description === "" ? (
                  <Error large margin={false}>
                    Missing collapsible description
                  </Error>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: detail.description
                    }}
                  />
                )}
              </DetailsContent>
            </Details>
          ))}
        <PageTitle missingText="Missing tertiary title">
          {tertiaryTitle}
        </PageTitle>
        <Description
          dangerouslySetInnerHTML={{ __html: tertiaryDescription }}
        />
      </Container>
    </EditorLayout>
  );
};

const mapStateToProps = (state, props) => {
  return merge({}, props, {
    intro: getIntro(
      state.questionnaireIntro,
      props.match.params.questionnaireId
    )
  });
};

const mapDispatchToProps = (dispatch, props) => {
  const { questionnaireId: id } = props.match.params;

  return {
    changeField: ({ name, value }) => dispatch(changeField(id, name, value))
  };
};

const withQuestionPage = flowRight(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter,
  withApollo
);

export const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaire($id: ID!) {
    questionnaire(id: $id) {
      id
      title
      description
      surveyId
      theme
      legalBasis
      navigation
      summary
      __typename
    }
  }
`;

export default withQuestionPage(props => (
  <Query
    query={QUESTIONNAIRE_QUERY}
    variables={{ id: props.match.params.questionnaireId }}
  >
    {innerProps => <UnwrappedPreviewIntroRoute {...innerProps} {...props} />}
  </Query>
));
