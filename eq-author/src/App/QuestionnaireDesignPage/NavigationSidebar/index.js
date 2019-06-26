import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";
import { flowRight } from "lodash";
import { withRouter } from "react-router";
import gql from "graphql-tag";

import ScrollPane from "components/ScrollPane";
import Logo from "components/Logo";

import SectionNav from "./SectionNav";
import NavigationHeader from "./NavigationHeader";
import IntroductionNavItem from "./IntroductionNavItem";

const Container = styled.div`
  background: ${colors.black};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavigationScrollPane = styled(ScrollPane)`
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${colors.lightGrey};
    }
  }
`;

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export class UnwrappedNavigationSidebar extends Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired,
    canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
    canAddQuestionPage: PropTypes.bool.isRequired,
  };

  handleAddSection = () => {
    this.props.onAddSection(this.props.questionnaire.id);
  };

  render() {
    const {
      questionnaire,
      onAddQuestionPage,
      onAddCalculatedSummaryPage,
      onAddQuestionConfirmation,
      canAddQuestionConfirmation,
      canAddCalculatedSummaryPage,
      canAddQuestionPage,
      loading,
    } = this.props;

    return (
      <Container data-test="side-nav">
        {loading ? null : (
          <>
            <Logo />
            <NavigationHeader
              questionnaire={questionnaire}
              onAddSection={this.handleAddSection}
              onAddCalculatedSummaryPage={onAddCalculatedSummaryPage}
              canAddCalculatedSummaryPage={canAddCalculatedSummaryPage}
              onAddQuestionPage={onAddQuestionPage}
              canAddQuestionPage={canAddQuestionPage}
              onAddQuestionConfirmation={onAddQuestionConfirmation}
              canAddQuestionConfirmation={canAddQuestionConfirmation}
              data-test="nav-section-header"
            />
            <NavigationScrollPane>
              <NavList>
                {questionnaire.introduction && (
                  <IntroductionNavItem
                    questionnaire={questionnaire}
                    data-test="nav-introduction"
                  />
                )}
                <li>
                  <SectionNav questionnaire={questionnaire} />
                </li>
              </NavList>
            </NavigationScrollPane>
          </>
        )}
      </Container>
    );
  }
}

UnwrappedNavigationSidebar.fragments = {
  NavigationSidebar: gql`
    fragment NavigationSidebar on Questionnaire {
      id
      ...SectionNav
      ...NavigationHeader
      ...IntroductionNavItem
    }

    ${NavigationHeader.fragments.NavigationHeader}
    ${SectionNav.fragments.SectionNav}
    ${IntroductionNavItem.fragments.IntroductionNavItem}
  `,
};

export default flowRight(withRouter)(UnwrappedNavigationSidebar);
