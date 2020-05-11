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
  margin-left: auto;
`;

const NavTitle = styled.div`
  padding-top: 0.1em;
  font-size: 0.7em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: bold;
`;

const QuestionnaireContent = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: solid 1px ${colors.darkGrey};
  margin-bottom: 0.5em;
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
          <NavTitle>Questionnaire content</NavTitle>

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
