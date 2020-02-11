import gql from "graphql-tag";
import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import PageNav from "./PageNav";
import NavLink from "./NavLink";
import { buildSectionPath } from "utils/UrlUtils";
import SectionIcon from "./icon-section.svg?inline";

const StyledSectionNavItem = styled.li`
  display: block;
`;

const SectionNameOuter = styled.span`
  padding-left: 0.5em;
`;

const StyledSectionOuter = styled.div`
  display: block;
  padding-top: 1px;
  padding-bottom: 1px;
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
`;

export class UnwrappedSectionNavItem extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    section: CustomPropTypes.section.isRequired,
    match: CustomPropTypes.match.isRequired,
  };

  render() {
    const { questionnaire, section, match, ...otherProps } = this.props;

    const url = buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: section.id,
      tab: match.params.tab,
    });

    return (
      <StyledSectionNavItem data-test="section-item" {...otherProps}>
        <StyledSectionOuter>
          <NavLink
            exact
            to={url}
            data-test="nav-section-link"
            title={section.displayName}
            icon={SectionIcon}
            id="sectionName"
            errorCount={section.validationErrorInfo.totalCount}
          >
            <SectionNameOuter>{section.displayName}</SectionNameOuter>
          </NavLink>
        </StyledSectionOuter>

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
      questionnaire {
        id
      }
      validationErrorInfo {
        id
        totalCount
      }
      ...PageNav
    }

    ${PageNav.fragments.PageNav}
  `,
};

export default withRouter(UnwrappedSectionNavItem);
