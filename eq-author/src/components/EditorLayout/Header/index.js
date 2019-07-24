import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
import { withRouter } from "react-router-dom";

import config from "config";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";

import { withMe } from "App/MeContext";

import Button from "components/buttons/Button";
import LinkButton from "components/buttons/Button/LinkButton";
import IconText from "components/IconText";
import ButtonGroup from "components/buttons/ButtonGroup";
import { withQuestionnaire } from "components/QuestionnaireContext";
import UserProfile from "components/UserProfile";

import shareIcon from "./icon-share.svg?inline";
import viewIcon from "./icon-view.svg?inline";
import settingsIcon from "./icon-cog.svg?inline";
import SharingModal from "./SharingModal";
import PageTitle from "./PageTitle";
import UpdateQuestionnaireSettingsModal from "./UpdateQuestionnaireSettingsModal";
import SavingIndicator from "./SavingIndicator";

const StyledHeader = styled.header`
  color: ${colors.white};
  background: ${colors.primary};
  font-weight: 400;
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 1em 1.5em;
`;

const Subtitle = styled.div`
  font-weight: bold;
`;

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
  margin-right: -1.5em;
`;

const SavingContainer = styled.div`
  position: absolute;
  right: 1em;
  bottom: 0.5em;
`;

export class UnconnectedHeader extends React.Component {
  state = {
    isSharingModalOpen: false,
    isQuestionnaireSettingsModalOpen:
      this.props.match.params.modifier === "settings",
  };

  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    title: PropTypes.string,
    client: PropTypes.shape({
      resetStore: PropTypes.func.isRequired,
    }),
    children: PropTypes.node.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        modifier: PropTypes.string,
      }).isRequired,
    }).isRequired,
    me: CustomPropTypes.user,
    loading: PropTypes.bool,
    validations: PropTypes.shape({
      errorCount: PropTypes.number.isRequired,
    }),
  };

  handleShare = () => {
    this.setState({ isSharingModalOpen: true });
  };

  handleQuestionnaireSettings = () => {
    this.setState({ isQuestionnaireSettingsModalOpen: true });
  };

  render() {
    const { questionnaire, title, children, me, client } = this.props;
    const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
      (questionnaire || {}).id
    }`;

    return (
      <>
        <StyledHeader>
          <Flex>
            <Subtitle>{questionnaire && questionnaire.displayName}</Subtitle>
            <UtilityBtns>
              {questionnaire && (
                <ButtonGroup
                  horizontal
                  align="right"
                  margin="0.5em"
                  gutter="0.5em"
                >
                  <Button
                    data-test="settings-btn"
                    variant="tertiary-light"
                    onClick={this.handleQuestionnaireSettings}
                    small
                  >
                    <IconText icon={settingsIcon}>Settings</IconText>
                  </Button>
                  <LinkButton
                    href={previewUrl}
                    variant="tertiary-light"
                    data-test="btn-preview"
                    small
                    disabled={questionnaire.totalErrorCount > 0}
                  >
                    <IconText icon={viewIcon}>View survey</IconText>
                  </LinkButton>
                  <Button
                    variant="tertiary-light"
                    onClick={this.handleShare}
                    data-test="btn-share"
                    small
                  >
                    <IconText icon={shareIcon}>Sharing</IconText>
                  </Button>
                  {me && <UserProfile client={client} />}
                </ButtonGroup>
              )}
            </UtilityBtns>
          </Flex>

          <PageTitle>{title}</PageTitle>
          {children}
          <SavingContainer>
            <SavingIndicator />
          </SavingContainer>
        </StyledHeader>
        {questionnaire && (
          <>
            {me && (
              <SharingModal
                questionnaire={questionnaire}
                previewUrl={previewUrl}
                displayToast={this.displayToast}
                isOpen={this.state.isSharingModalOpen}
                onClose={() => this.setState({ isSharingModalOpen: false })}
                currentUser={me}
              />
            )}
            <UpdateQuestionnaireSettingsModal
              isOpen={this.state.isQuestionnaireSettingsModalOpen}
              onClose={() =>
                this.setState({ isQuestionnaireSettingsModalOpen: false })
              }
              questionnaire={questionnaire}
            />
          </>
        )}
      </>
    );
  }
}

export default flowRight(
  withQuestionnaire,
  withRouter,
  withMe
)(UnconnectedHeader);
