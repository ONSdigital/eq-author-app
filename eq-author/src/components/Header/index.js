import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight, get } from "lodash/fp";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

import config from "config";
import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";

import { signOutUser } from "redux/auth/actions";

import Button from "components/buttons/Button";
import LinkButton from "components/buttons/Button/LinkButton";
import IconText from "components/IconText";
import Truncated from "components/Truncated";

import { Routes } from "utils/UrlUtils";

import logo from "./logo.svg";
import shareIcon from "./icon-share.svg?inline";
import viewIcon from "./icon-view.svg?inline";
import UserProfile from "./UserProfile";
import SharingModal from "./SharingModal";

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
  state = {
    isSharingModalOpen: false,
  };

  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    signOutUser: PropTypes.func.isRequired,
    title: PropTypes.string,
    client: PropTypes.shape({
      resetStore: PropTypes.func.isRequired,
    }),
  };

  handleSignOut = () => {
    this.props.signOutUser();
    this.props.client.resetStore();
  };

  handleShare = () => {
    this.setState({ isSharingModalOpen: true });
  };

  render() {
    const { questionnaire, title } = this.props;
    const currentUser = get("data.me", this.props);

    const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
      (questionnaire || {}).id
    }`;

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
            <>
              <LinkButton
                href={previewUrl}
                variant="tertiary-light"
                data-test="btn-preview"
                small
              >
                <IconText icon={viewIcon}>View survey</IconText>
              </LinkButton>
              <ShareButton
                variant="tertiary-light"
                onClick={this.handleShare}
                data-test="btn-share"
                small
              >
                <IconText icon={shareIcon}>Sharing</IconText>
              </ShareButton>
              <SharingModal
                questionnaire={questionnaire}
                previewUrl={previewUrl}
                displayToast={this.displayToast}
                isOpen={this.state.isSharingModalOpen}
                onClose={() => this.setState({ isSharingModalOpen: false })}
              />
            </>
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

export const CURRENT_USER_QUERY = gql`
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
    { signOutUser }
  ),
  withRouter,
  withCurrentUser
)(UnconnectedHeader);
