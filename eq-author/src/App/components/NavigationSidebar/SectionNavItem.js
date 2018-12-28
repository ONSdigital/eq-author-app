import gql from "graphql-tag";
import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import PageNav from "App/components/NavigationSidebar/PageNav";
import NavLink from "App/components/NavigationSidebar/NavLink";
import { buildQuestionnairePath } from "utils/UrlUtils";
import SectionIcon from "App/components/NavigationSidebar/icon-section.svg?inline";

const StyledSectionNavItem = styled.li`
  display: block;
`;

export class UnwrappedSectionNavItem extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    section: CustomPropTypes.section.isRequired,
    match: CustomPropTypes.match
  };

  render() {
    const { questionnaire, section, match, ...otherProps } = this.props;

    const url = buildQuestionnairePath({
      questionnaireId: questionnaire.id,
      sectionId: section.id,
      tab: match.params.tab
    });

    return (
      <StyledSectionNavItem data-test="section-item" {...otherProps}>
        <NavLink
          exact
          to={url}
          data-test="nav-section-link"
          title={section.displayName}
          icon={SectionIcon}
        >
          {section.displayName}
        </NavLink>

        <PageNav section={section} questionnaire={questionnaire} />
      </StyledSectionNavItem>
    );
  }
}

UnwrappedSectionNavItem.fragments = {
  SectionNavItem: gql`
    fragment SectionNavItem on Section {
      id
      title
      displayName
      ...PageNav
    }

    ${PageNav.fragments.PageNav}
  `
};

export default withRouter(UnwrappedSectionNavItem);
