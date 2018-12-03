import React from "react";

import { Titled } from "react-titled";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Toolbar } from "App/questionPage/Design/EditorToolbar/index.js";
import EditorLayout from "App/questionPage/Design/EditorLayout/index.js";

import QuestionnaireIntroEditor from "./QuestionnaireIntroEditor";
import {
  toggleIntro,
  addDetail,
  removeDetail,
  moveDetailUp,
  moveDetailDown,
  changeField,
  updateDetail
} from "redux/questionnaireIntro/actions";
import { getIntro } from "redux/questionnaireIntro/reducer";

import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { flowRight, merge, get } from "lodash";
import Loading from "components/Loading";
import Error from "components/Error";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label } from "components/Forms";
import styled from "styled-components";

const ToggleField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Padding = styled.div`
  padding: 0.5em 1em 0;
  position: relative;
  width: 100%;
`;

const QuestionnaireIntroRoute = ({
  match,
  data,
  error,
  loading,
  toggleIntro,
  addDetail,
  removeDetail,
  moveDetailUp,
  moveDetailDown,
  changeField,
  updateDetail,
  intro
}) => {
  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }

  if (error) {
    return <Error>Something went wrong</Error>;
  }

  return (
    <EditorLayout design preview={intro.enabled}>
      <Titled title={() => "Questionnaire Introduction"}>
        <Padding>
          <ToggleField>
            <Label style={{ margin: 0 }} htmlFor="toggle-q-intro">
              Enabled
            </Label>
            <ToggleSwitch
              id="toggle-q-intro"
              name="toggle-q-intro"
              onChange={toggleIntro}
              checked={intro.enabled}
              autoFocus={!intro.enabled}
            />
          </ToggleField>
        </Padding>

        <QuestionnaireIntroEditor
          intro={intro}
          enabled={intro.enabled}
          questionnaire={data.questionnaire}
          addDetail={addDetail}
          removeDetail={removeDetail}
          moveDetailUp={moveDetailUp}
          moveDetailDown={moveDetailDown}
          onChange={changeField}
          updateDetail={updateDetail}
        />
      </Titled>
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
    toggleIntro: () => dispatch(toggleIntro(id)),
    addDetail: () => dispatch(addDetail(id)),
    removeDetail: detailId => dispatch(removeDetail(id, detailId)),
    moveDetailUp: detailId => dispatch(moveDetailUp(id, detailId)),
    moveDetailDown: detailId => dispatch(moveDetailDown(id, detailId)),
    changeField: ({ name, value }) => dispatch(changeField(id, name, value)),
    updateDetail: ({ name, value }) => dispatch(updateDetail(id, name, value))
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
      metadata {
        id
        displayName
        __typename
      }
      __typename
    }
  }
`;

export default withQuestionPage(props => (
  <Query
    query={QUESTIONNAIRE_QUERY}
    variables={{ id: props.match.params.questionnaireId }}
  >
    {innerProps => <QuestionnaireIntroRoute {...innerProps} {...props} />}
  </Query>
));
