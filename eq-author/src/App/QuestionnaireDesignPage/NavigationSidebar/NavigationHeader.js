import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { colors } from "constants/theme";
import CustomPropTypes from "custom-prop-types";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import AddMenu from "./AddMenu";

const StyledAddMenu = styled(AddMenu)`
  width: 100%;
`;

const QuestionnaireContent = styled.div`
  border-bottom: solid 1px ${colors.darkGrey};
`;

export class UnwrappedNavigationHeader extends React.Component {
  static propTypes = {
    canAddQuestionPage: PropTypes.bool.isRequired,
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    match: CustomPropTypes.match.isRequired,
  };

  state = {
    addMenuOpen: false,
  };

  handleAddMenuToggle = () =>
    this.setState({ addMenuOpen: !this.state.addMenuOpen });

  handleAddQuestionPage = () => {
    this.props.onAddQuestionPage();
    this.handleAddMenuToggle();
  };

  handleAddSection = () => {
    this.props.onAddSection();
    this.handleAddMenuToggle();
  };

  handleAddQuestionConfirmation = () => {
    this.props.onAddQuestionConfirmation();
    this.handleAddMenuToggle();
  };

  handleAddCalculatedSummaryPage = () => {
    this.props.onAddCalculatedSummaryPage();
    this.handleAddMenuToggle();
  };

  render() {
    return (
      <>
        <QuestionnaireContent>
          <StyledAddMenu
            addMenuOpen={this.state.addMenuOpen}
            onAddMenuToggle={this.handleAddMenuToggle}
            onAddQuestionPage={this.handleAddQuestionPage}
            canAddQuestionPage={this.props.canAddQuestionPage}
            onAddCalculatedSummaryPage={this.handleAddCalculatedSummaryPage}
            canAddCalculatedSummaryPage={this.props.canAddCalculatedSummaryPage}
            onAddSection={this.handleAddSection}
            onAddQuestionConfirmation={this.handleAddQuestionConfirmation}
            canAddQuestionConfirmation={this.props.canAddQuestionConfirmation}
            data-test="add-menu"
          />
        </QuestionnaireContent>
      </>
    );
  }
}

UnwrappedNavigationHeader.fragments = {
  NavigationHeader: gql`
    fragment NavigationHeader on Questionnaire {
      ...QuestionnaireSettingsModal
    }

    ${QuestionnaireSettingsModal.fragments.QuestionnaireSettingsModal}
  `,
};

export default withRouter(UnwrappedNavigationHeader);
