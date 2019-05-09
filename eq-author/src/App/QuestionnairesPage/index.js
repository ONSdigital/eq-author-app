import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight } from "lodash";
import { Titled } from "react-titled";
import { connect } from "react-redux";

import { propType } from "graphql-anywhere";
import ScrollPane from "components/ScrollPane";
import BaseLayout from "components/BaseLayout";

import { CenteredPanel } from "components/Panel";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import MainCanvas from "components/MainCanvas";
import Loading from "components/Loading";
import Error from "components/Error";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import QuestionnairesTable from "./QuestionnairesTable";
import withDeleteQuestionnaire from "./withDeleteQuestionnaire";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import { raiseToast } from "redux/toast/actions";

const StyledButtonGroup = styled(ButtonGroup)`
  margin: 1em 0;
  display: flex;
  justify-content: flex-end;
`;

const StyledCenteredPanel = styled(CenteredPanel)`
  padding: 0;
`;

const QUESTIONNAIRES_QUERY = gql`
  query GetQuestionnaireList {
    questionnaires {
      ...QuestionnaireDetails
    }
  }
  ${QuestionnairesTable.fragments.QuestionnaireDetails}
`;

export class UnconnectedQuestionnairesPage extends React.PureComponent {
  state = {
    isModalOpen: false,
  };

  handleModalOpen = () => this.setState({ isModalOpen: true });
  handleModalClose = () => this.setState({ isModalOpen: false });

  renderResults = response => {
    const { loading, error, data } = response;

    if (loading) {
      return <Loading height="24.25rem">Questionnaires loading…</Loading>;
    }

    if (error) {
      return <Error>Oops! Questionnaires could not be found</Error>;
    }

    return (
      <QuestionnairesTable
        questionnaires={data.questionnaires}
        onDeleteQuestionnaire={this.props.onDeleteQuestionnaire}
        onDuplicateQuestionnaire={this.props.onDuplicateQuestionnaire}
      />
    );
  };

  renderTitle = title => `Your Questionnaires - ${title}`;

  render() {
    const { onCreateQuestionnaire } = this.props;
    return (
      <Titled title={this.renderTitle}>
        <BaseLayout title={"Your Questionnaires"}>
          <ScrollPane permanentScrollBar>
            <MainCanvas>
              <StyledButtonGroup horizontal>
                <Button
                  onClick={this.handleModalOpen}
                  primary
                  data-test="create-questionnaire"
                >
                  Create questionnaire
                </Button>
                <QuestionnaireSettingsModal
                  isOpen={this.state.isModalOpen}
                  onClose={this.handleModalClose}
                  onSubmit={onCreateQuestionnaire}
                  confirmText="Create"
                />
              </StyledButtonGroup>
              <StyledCenteredPanel>
                <Query query={QUESTIONNAIRES_QUERY}>{this.renderResults}</Query>
              </StyledCenteredPanel>
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
