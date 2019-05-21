import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";

import { isEmpty } from "lodash";

import QuestionnairesTable from "./QuestionnairesTable";

import { colors } from "constants/theme";

import Button from "components/buttons/Button";
import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import flag from "./flag.svg";

const Header = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: flex-end;
`;

const NoResults = styled.div`
  padding: 6em 0 10em;
  text-align: center;
`;

const NoResultsTitle = styled.h2`
  font-size: 1.3em;
  font-weight: 500;
  margin: 0 0 0.5em;

  &::before {
    content: url(${flag});
    display: block;
  }
`;

const NoResultsText = styled.p`
  margin: 0 0 1em;
  color: ${colors.textLight};
`;

class QuestionnairesView extends PureComponent {
  state = {
    isModalOpen: false,
  };

  handleModalOpen = () => this.setState({ isModalOpen: true });
  handleModalClose = () => this.setState({ isModalOpen: false });

  render() {
    const {
      questionnaires,
      onDeleteQuestionnaire,
      onDuplicateQuestionnaire,
      onCreateQuestionnaire,
    } = this.props;

    return (
      <>
        {isEmpty(questionnaires) ? (
          <NoResults>
            <NoResultsTitle>No questionnaires found</NoResultsTitle>
            <NoResultsText>
              {"You don't have access to any questionnaires yet."}
            </NoResultsText>
            <Button
              onClick={this.handleModalOpen}
              variant="primary"
              data-test="create-questionnaire"
            >
              Create a questionnaire
            </Button>
          </NoResults>
        ) : (
          <>
            <Header>
              <Button
                onClick={this.handleModalOpen}
                primary
                data-test="create-questionnaire"
              >
                Create questionnaire
              </Button>
            </Header>
            <QuestionnairesTable
              questionnaires={questionnaires}
              onDeleteQuestionnaire={onDeleteQuestionnaire}
              onDuplicateQuestionnaire={onDuplicateQuestionnaire}
            />
          </>
        )}
        <QuestionnaireSettingsModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
          onSubmit={questionnaire => onCreateQuestionnaire(questionnaire)}
          confirmText="Create"
        />
      </>
    );
  }
}

QuestionnairesView.propTypes = {
  questionnaires: PropTypes.arrayOf(
    propType(QuestionnairesTable.fragments.QuestionnaireDetails)
  ),
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
};

export default QuestionnairesView;
