import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "constants/theme";
import config from "config";

import { raiseToast } from "redux/toast/actions";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Link, withRouter } from "react-router-dom";

import Button from "components/buttons/Button";
import LinkButton from "components/buttons/Button/LinkButton";
import UserProfile from "App/UserProfile";

import { signOutUser } from "redux/auth/actions";

import logo from "components/Header/logo.svg";

import shareIcon from "components/Header/icon-share.svg?inline";
import viewIcon from "components/Header/icon-view.svg?inline";

import IconText from "components/IconText";
import Truncated from "components/Truncated";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight, get } from "lodash/fp";
import { Routes } from "utils/UrlUtils";

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
    signOutUser: PropTypes.func.isRequired,
    raiseToast: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  displayToast = () => {
    this.props.raiseToast("ShareToast", "Link copied to clipboard");
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

  canLaunchSurvey = () => {
    let surveyValid = true;

    this.props.questionnaire.sections.forEach(section => {
      section.pages.forEach(page => {
        if (
          page.validationErrorInfo &&
          page.validationErrorInfo.totalCount > 0
        ) {
          surveyValid = false;
        }
      });
    });

    return surveyValid;
  };

  render() {
    const { questionnaire, title } = this.props;
    const currentUser = get("data.me", this.props);

    return (
      <StyledHeader>
        <LogoContainer>
          <Logo to="/" data-test="logo">
            <LogoImg src={logo} alt="Author" width={20} />
          </Logo>
        </LogoContainer>
        <QuestionnaireTitle>
          <Title data-test="questionnaire-title">
            {questionnaire ? questionnaire.displayName : title}
          </Title>
        </QuestionnaireTitle>

        <UtilityBtns>
          {questionnaire && (
            <React.Fragment>
              <LinkButton
                href={this.getPreviewUrl(this.props.questionnaire.id)}
                variant="tertiary-light"
                data-test="btn-preview"
                small
                disabled={!this.canLaunchSurvey()}
              >
                <IconText icon={viewIcon}>View survey</IconText>
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
          {currentUser && (
            <StyledUserProfile
              user={currentUser}
              onSignOut={this.handleSignOut}
            />
          )}
        </UtilityBtns>
      </StyledHeader>
    );
  }
}

const CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      picture
    }
  }
`;

export const withCurrentUser = Component => {
  const Comp = props =>
    props.match.path !== Routes.SIGN_IN ? (
      <Query query={CURRENT_USER_QUERY} fetchPolicy="network-only">
        {innerProps => {
          return <Component {...innerProps} {...props} />;
        }}
      </Query>
    ) : (
      <Component {...props} />
    );
  Comp.propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };
  return Comp;
};

export default flowRight(
  connect(
    null,
    { signOutUser, raiseToast }
  ),
  withRouter,
  withCurrentUser
)(UnconnectedHeader);
