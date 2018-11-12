import React from "react";
import styled from "styled-components";

import PageNav from "components/NavigationSidebar/PageNav";
import NavLink from "./NavLink";
import CustomPropTypes from "custom-prop-types";
import { buildSectionPath } from "utils/UrlUtils";
import SectionIcon from "./icon-section.svg?inline";
import gql from "graphql-tag";

const StyledSectionNavItem = styled.li`
  display: block;
`;

class SectionNavItem extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    section: CustomPropTypes.section.isRequired
  };

  render() {
    const { questionnaire, section, ...otherProps } = this.props;
    const url = buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: section.id
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

SectionNavItem.fragments = {
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

export default SectionNavItem;
