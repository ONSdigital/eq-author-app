import React from "react";

import PropTypes from "prop-types";

import { flowRight } from "lodash";

import { connect } from "react-redux";

import CustomPropTypes from "custom-prop-types";

import BaseLayout from "components/BaseLayout";

import MainCanvas from "components/MainCanvas";
import Loading from "components/Loading";
import Error from "components/Error";

import withQuestionnaireList from "./withQuestionnaireList";
import withDeleteQuestionnaire from "./withDeleteQuestionnaire";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import { raiseToast } from "redux/toast/actions";

import ScrollPane from "components/ScrollPane";
import QuestionnairesView from "./QuestionnairesView";

export class UnconnectedQuestionnairesPage extends React.PureComponent {
  render() {
    const { loading, error, questionnaires, ...otherProps } = this.props;

    if (loading) {
      return <Loading height="24.25rem">Questionnaires loading…</Loading>;
    }

    if (error) {
      return <Error>Oops! Questionnaires could not be found</Error>;
    }

    return (
      <BaseLayout title={"Your Questionnaires"}>
        <ScrollPane permanentScrollBar>
          <MainCanvas width="65em">
            <QuestionnairesView
              questionnaires={questionnaires}
              {...otherProps}
            />
          </MainCanvas>
        </ScrollPane>
      </BaseLayout>
    );
  }
}

UnconnectedQuestionnairesPage.propTypes = {
  loading: PropTypes.bool,
  questionnaires: CustomPropTypes.questionnaireList,
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
};

export default flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withCreateQuestionnaire,
  withDuplicateQuestionnaire,
  withDeleteQuestionnaire, // relies on raiseToast to display undo
  withQuestionnaireList
)(UnconnectedQuestionnairesPage);
