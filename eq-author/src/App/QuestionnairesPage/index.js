import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight } from "lodash";
import { Titled } from "react-titled";
import { connect } from "react-redux";

import { propType } from "graphql-anywhere";
import ScrollPane from "components/ScrollPane";
import BaseLayout from "components/BaseLayout";

import MainCanvas from "components/MainCanvas";
import Loading from "components/Loading";
import Error from "components/Error";

import QuestionnairesTable from "./QuestionnairesView/QuestionnairesTable";
import QuestionnairesView from "./QuestionnairesView";

import withDeleteQuestionnaire from "./withDeleteQuestionnaire";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import { raiseToast } from "redux/toast/actions";

const QUESTIONNAIRES_QUERY = gql`
  query GetQuestionnaireList {
    questionnaires {
      ...QuestionnaireDetails
    }
  }
  ${QuestionnairesTable.fragments.QuestionnaireDetails}
`;

export class UnconnectedQuestionnairesPage extends React.PureComponent {
  renderResults = response => {
    const { loading, error, data } = response;

    if (loading) {
      return <Loading height="24.25rem">Questionnaires loading…</Loading>;
    }

    if (error) {
      return <Error>Oops! Questionnaires could not be found</Error>;
    }

    return (
      <QuestionnairesView
        questionnaires={data.questionnaires}
        onDeleteQuestionnaire={this.props.onDeleteQuestionnaire}
        onDuplicateQuestionnaire={this.props.onDuplicateQuestionnaire}
        onCreateQuestionnaire={this.props.onCreateQuestionnaire}
      />
    );
  };

  renderTitle = title => `Your Questionnaires - ${title}`;

  render() {
    return (
      <Titled title={this.renderTitle}>
        <BaseLayout title={"Your Questionnaires"}>
          <ScrollPane permanentScrollBar>
            <MainCanvas maxWidth="70em">
              <Query
                fetchPolicy="cache-and-network"
                query={QUESTIONNAIRES_QUERY}
              >
                {this.renderResults}
              </Query>
            </MainCanvas>
          </ScrollPane>
        </BaseLayout>
      </Titled>
    );
  }
}

UnconnectedQuestionnairesPage.propTypes = {
  loading: PropTypes.bool,
  questionnaires: PropTypes.arrayOf(
    propType(QuestionnairesTable.fragments.QuestionnaireDetails)
  ),
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
  withDeleteQuestionnaire
)(UnconnectedQuestionnairesPage);
