import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import gql from "graphql-tag";

import CustomPropTypes from "custom-prop-types";
import HomeIcon from "./icon-home.svg?inline";
import MetadataIcon from "./icon-metadata.svg?inline";
import HistoryIcon from "./icon-history.svg?inline";

import { withMe } from "App/MeContext";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import RouteButton from "components/buttons/Button/RouteButton";
import IconText from "components/IconText";

import { buildMetadataPath, buildHistoryPath } from "utils/UrlUtils";
import AddMenu from "./AddMenu";

const IconList = styled.ul`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  z-index: 9999;
  flex: 1 1 auto;
`;

const IconListItem = styled.li`
  display: flex;
  align-items: center;
  margin-right: 1em;
`;

const HomeIconLink = styled(HomeIcon)`
  vertical-align: middle;
`;

const StyledAddMenu = styled(AddMenu)`
  margin-left: auto;
`;

const NavTitle = styled.div`
  font-size: 0.8em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: bold;
`;

const QuestionnaireLinks = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em;
`;

const QuestionnaireContent = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
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
    me: CustomPropTypes.me.isRequired,
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
    const { match, me } = this.props;
    const metadataUrl = buildMetadataPath(match.params);
    const historyUrl = buildHistoryPath(match.params);
    return (
      <>
        <QuestionnaireLinks>
          <IconList>
            <IconListItem>
              <RouteButton variant="tertiary-light" small to="/">
                <IconText icon={HomeIconLink}>Home</IconText>
              </RouteButton>
            </IconListItem>
            <IconListItem>
              <RouteButton variant="tertiary-light" small to={metadataUrl}>
                <IconText icon={MetadataIcon}>Metadata</IconText>
              </RouteButton>
            </IconListItem>
            {me.admin && (
              <IconListItem>
                <RouteButton variant="tertiary-light" small to={historyUrl}>
                  <IconText icon={HistoryIcon}>History</IconText>
                </RouteButton>
              </IconListItem>
            )}
          </IconList>
        </QuestionnaireLinks>
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

export default withMe(withRouter(UnwrappedNavigationHeader));
