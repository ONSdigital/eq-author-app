import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { TransitionGroup } from "react-transition-group";
import { isEmpty } from "lodash";
import gql from "graphql-tag";
import { colors } from "constants/theme";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import questionConfirmationIcon from "./icon-questionnaire.svg";

import Row from "App/QuestionnairesPage/QuestionnairesTable/Row";

const Table = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const TH = styled.th`
  padding: 1em;
  color: ${colors.darkGrey};
  width: ${props => props.colWidth};
  border-bottom: 1px solid #e2e2e2;
  font-weight: normal;
  font-size: 0.9em;
`;

TH.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

const Panel = styled.div`
  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export class UnconnectedQuestionnairesTable extends React.PureComponent {
  static fragments = {
    QuestionnaireDetails: gql`
      fragment QuestionnaireDetails on Questionnaire {
        id
        title
        shortTitle
        displayName
        createdAt
        createdBy {
          id
          name
        }
      }
    `,
  };
  static propTypes = {
    questionnaires: PropTypes.arrayOf(
      propType(UnconnectedQuestionnairesTable.fragments.QuestionnaireDetails)
    ),
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
  };

  state = {
    focusedId: null,
    showDeleteQuestionnaireDialog: false,
    deleteQuestionnaire: null,
  };

  handleOpenDeleteQuestionnaireDialog = deleteQuestionnaire => {
    this.setState({
      showDeleteQuestionnaireDialog: true,
      deleteQuestionnaire,
    });
  };

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

  renderRows = questionnaires =>
    questionnaires.map(questionnaire => {
      return (
        <Row
          key={questionnaire.id}
          autoFocus={questionnaire.id === this.state.focusedId}
          questionnaire={questionnaire}
          onDeleteQuestionnaire={this.handleOpenDeleteQuestionnaireDialog}
          onDuplicateQuestionnaire={this.props.onDuplicateQuestionnaire}
        />
      );
    });

  render() {
    const { questionnaires } = this.props;
    const { showDeleteQuestionnaireDialog, deleteQuestionnaire } = this.state;

    if (isEmpty(questionnaires)) {
      return <p>You have no questionnaires</p>;
    }

    return (
      <Panel>
        <Table>
          <thead>
            <tr>
              <TH colWidth="50%">Title</TH>
              <TH colWidth="15%">Created</TH>
              <TH colWidth="20%">Owner</TH>
              <TH colWidth="15%">Actions</TH>
            </tr>
          </thead>
          <TransitionGroup component="tbody">
            {this.renderRows(questionnaires)}
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
      </Panel>
    );
  }
}

export default UnconnectedQuestionnairesTable;
