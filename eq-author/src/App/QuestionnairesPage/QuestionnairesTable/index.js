import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { TransitionGroup } from "react-transition-group";
import { isEmpty } from "lodash";
import gql from "graphql-tag";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import questionConfirmationIcon from "./icon-questionnaire.svg";

import Row from "App/QuestionnairesPage/QuestionnairesTable/Row";

const Table = styled.table`
  width: 100%;
  font-size: 0.9em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const TH = styled.th`
  padding: 1.5em 1em;
  color: #8e8e8e;
  width: ${props => props.colWidth};
  border-bottom: 1px solid #e2e2e2;
`;

TH.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

const TBody = props => <tbody {...props} />;

export class UnconnectedQuestionnairesTable extends React.PureComponent {
  static propTypes = {
    questionnaires: CustomPropTypes.questionnaireList,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
  };

  static fragments = {
    QuestionnaireDetails: gql`
      fragment QuestionnaireDetails on Questionnaire {
        id
        displayName
        createdAt
        createdBy {
          id
          name
        }
      }
    `,
  };

  state = {
    focusedId: null,
    showDeleteQuestionnaireDialog: false,
    deleteQuestionnaire: null,
  };

  handleOpenDeleteQuestionnaireDialog = deleteQuestionnaire =>
    this.setState({
      showDeleteQuestionnaireDialog: true,
      deleteQuestionnaire,
    });

  handleCloseDeleteQuestionnaireDialog = () => {
    this.setState({
      showDeleteQuestionnaireDialog: false,
      deleteQuestionnaire: null,
    });
  };

  handleDeleteQuestionnaire = () => {
    const { questionnaires } = this.props;
    const { deleteQuestionnaire } = this.state;

    const possibleNextIndex =
      questionnaires.indexOf(
        questionnaires.find(q => q.id === deleteQuestionnaire.id)
      ) + 1;

    // If the last one is being removed then focus the one before that
    const nextIndex =
      possibleNextIndex > questionnaires.length - 1
        ? questionnaires.length - 2
        : possibleNextIndex;

    // We have to account to set focusedId to undefined when there are no
    // questionnaires left
    this.setState({
      focusedId: (questionnaires[nextIndex] || {}).id,
      showDeleteQuestionnaireDialog: false,
      deleteQuestionnaire: null,
    });

    this.props.onDeleteQuestionnaire(deleteQuestionnaire.id);
  };

  render() {
    const { questionnaires } = this.props;
    const { showDeleteQuestionnaireDialog, deleteQuestionnaire } = this.state;

    if (isEmpty(questionnaires)) {
      return <p>You have no questionnaires</p>;
    }

    return (
      <>
        <Table>
          <thead>
            <tr>
              <TH colWidth="50%">Questionnaire name</TH>
              <TH colWidth="15%">Date</TH>
              <TH colWidth="22%">Created by</TH>
              <TH colWidth="14%" />
            </tr>
          </thead>
          <TransitionGroup component={TBody}>
            {questionnaires.map(questionnaire => {
              return (
                <Row
                  key={questionnaire.id}
                  autoFocus={questionnaire.id === this.state.focusedId}
                  questionnaire={questionnaire}
                  onDeleteQuestionnaire={
                    this.handleOpenDeleteQuestionnaireDialog
                  }
                  onDuplicateQuestionnaire={this.props.onDuplicateQuestionnaire}
                />
              );
            })}
          </TransitionGroup>
        </Table>
        <DeleteConfirmDialog
          isOpen={showDeleteQuestionnaireDialog}
          onClose={this.handleCloseDeleteQuestionnaireDialog}
          onDelete={this.handleDeleteQuestionnaire}
          title={deleteQuestionnaire && deleteQuestionnaire.displayName}
          alertText="This questionnaire including all sections and questions will be deleted."
          icon={questionConfirmationIcon}
          data-test="delete-questionnaire"
        />
      </>
    );
  }
}

export default UnconnectedQuestionnairesTable;
