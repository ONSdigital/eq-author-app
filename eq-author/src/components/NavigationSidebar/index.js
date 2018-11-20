import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";
import SectionNav from "components/NavigationSidebar/SectionNav";
import NavigationHeader from "components/NavigationSidebar/NavigationHeader";
import ScrollPane from "components/ScrollPane";
import { flowRight } from "lodash";
import { withRouter } from "react-router";
import gql from "graphql-tag";

import withCreateSection from "containers/enhancers/withCreateSection";
import withUpdateQuestionnaire from "containers/enhancers/withUpdateQuestionnaire";

const Container = styled.div`
  background: ${colors.darkBlue};
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

export class UnwrappedNavigationSidebar extends Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    onAddPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    onUpdateQuestionnaire: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired
  };

  handleAddSection = () => {
    this.props.onAddSection(this.props.questionnaire.id);
  };

  render() {
    const {
      questionnaire,
      onUpdateQuestionnaire,
      onAddPage,
      onAddQuestionConfirmation,
      canAddQuestionConfirmation,
      loading
    } = this.props;

    return (
      <Container data-test="side-nav">
        {loading ? null : (
          <React.Fragment>
            <NavigationHeader
              questionnaire={questionnaire}
              onUpdateQuestionnaire={onUpdateQuestionnaire}
              onAddSection={this.handleAddSection}
              onAddPage={onAddPage}
              onAddQuestionConfirmation={onAddQuestionConfirmation}
              canAddQuestionConfirmation={canAddQuestionConfirmation}
              data-test="nav-section-header"
            />
            <NavigationScrollPane>
              <SectionNav questionnaire={questionnaire} />
            </NavigationScrollPane>
          </React.Fragment>
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
    }

    ${NavigationHeader.fragments.NavigationHeader}
    ${SectionNav.fragments.SectionNav}
  `
};

export default flowRight(
  withRouter,
  withCreateSection,
  withUpdateQuestionnaire
)(UnwrappedNavigationSidebar);
