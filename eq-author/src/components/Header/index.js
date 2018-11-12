import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "constants/theme";
import config from "config";

import { raiseToast } from "redux/toast/actions";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Link } from "react-router-dom";

import Button from "components/Button";
import LinkButton from "components/Button/LinkButton";
import UserProfile from "components/UserProfile";

import { getUser } from "redux/auth/reducer";
import { signOutUser } from "redux/auth/actions";

import logo from "./logo.svg";

import shareIcon from "./icon-share.svg?inline";
import previewIcon from "./icon-preview.svg?inline";

import IconText from "components/IconText";
import Truncated from "../Truncated";

const StyledHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  background-color: ${colors.black};
  color: ${colors.white};
  font-weight: 400;
  padding: 1em 1.5em;
  height: 4em;
`;

const QuestionnaireTitle = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: pre;
`;

const TruncatedTitle = Truncated.withComponent("h1");
const Title = styled(TruncatedTitle)`
  font-size: 1em;
  font-weight: 600;
  margin: 0 2em;
  width: 100%;
  text-align: center;
  line-height: 1.3;
`;

const ShareButton = styled(Button)`
  margin-left: 0.5em;
`;

export const StyledUserProfile = styled(UserProfile)`
  width: auto;
  margin-left: 0.5em;
`;

const LogoContainer = styled.div`
  flex: 1 0 25%;
`;

export const Logo = styled(Link)`
  padding: 0.5em;
  width: 6.5em;
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  display: inline-block;
  width: 100%;
  height: auto;
`;

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
`;

export class UnconnectedHeader extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    user: CustomPropTypes.user,
    signOutUser: PropTypes.func.isRequired,
    raiseToast: PropTypes.func.isRequired
  };

  displayToast = () => {
    this.props.raiseToast("ShareToast", "Preview link copied to clipboard");
  };

  handleSignOut = () => {
    this.props.signOutUser();
  };

  getPreviewUrl(questionnaireId) {
    return `${config.REACT_APP_LAUNCH_URL}/${questionnaireId}`;
  }

  handleShare = () => {
    const textField = document.createElement("textarea");
    textField.innerText = this.getPreviewUrl(this.props.questionnaire.id);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    this.displayToast();
  };

  render() {
    const { questionnaire } = this.props;

    return (
      <StyledHeader>
        <LogoContainer>
          <Logo to="/" data-test="logo">
            <LogoImg src={logo} alt="Author" width={20} />
          </Logo>
        </LogoContainer>
        <QuestionnaireTitle>
          {questionnaire && (
            <Title data-test="questionnaire-title">{questionnaire.title}</Title>
          )}
        </QuestionnaireTitle>

        <UtilityBtns>
          {questionnaire && (
            <React.Fragment>
              <LinkButton
                href={this.getPreviewUrl(this.props.questionnaire.id)}
                variant="tertiary-light"
                data-test="btn-preview"
                small
              >
                <IconText icon={previewIcon}>Preview</IconText>
              </LinkButton>
              <ShareButton
                variant="tertiary-light"
                onClick={this.handleShare}
                data-test="btn-share"
                small
              >
                <IconText icon={shareIcon}>Share</IconText>
              </ShareButton>
            </React.Fragment>
          )}
          {this.props.user && (
            <StyledUserProfile
              user={this.props.user}
              onSignOut={this.handleSignOut}
            />
          )}
        </UtilityBtns>
      </StyledHeader>
    );
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
});

export default connect(
  mapStateToProps,
  { signOutUser, raiseToast }
)(UnconnectedHeader);
