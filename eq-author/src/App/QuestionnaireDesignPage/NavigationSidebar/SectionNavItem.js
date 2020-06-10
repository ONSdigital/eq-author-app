import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { buildSectionPath } from "utils/UrlUtils";
import NavLink from "./NavLink";
import PageNav from "./PageNav";

import { colors } from "constants/theme";
import SectionIcon from "./icon-section.svg?inline";

import SectionsAccordion from "components/AccordionSectionsNav";

const StyledSectionsAccordion = styled(SectionsAccordion)`
  padding-left: 0.5em;
`;

const StyledSectionNavItem = styled.li`
  display: block;
`;

const SectionNameOuter = styled.span`
  padding-left: 0.5em;
  letter-spacing: 0;
`;

const StyledSectionUpper = styled.div`
  display: block;
  padding-top: 1px;
  border-top: 1px solid ${colors.grey};
`;

const StyledSectionLower = styled.div`
  display: block;
  padding-bottom: 1px;
  margin-bottom: 1px;
  border-bottom: 1px solid ${colors.grey};
`;

export class UnwrappedSectionNavItem extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    section: CustomPropTypes.section.isRequired,
    match: CustomPropTypes.match.isRequired,
    controlGroup: PropTypes.bool.isRequired,
    identity: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
  };

  render() {
    const {
      questionnaire,
      section,
      match,
      controlGroup,
      handleChange,
      identity,
      ...otherProps
    } = this.props;

    const url = buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: section.id,
      tab: match.params.tab,
    });

    const SectionTitle = () => (
      <>
        <StyledSectionUpper>
          <div />
        </StyledSectionUpper>
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
        <StyledSectionLower>
          <div />
        </StyledSectionLower>
      </>
    );

    return (
      <StyledSectionsAccordion
        title={<SectionTitle />}
        titleName={section.displayName}
        url={url}
        controlGroup={controlGroup}
        identity={identity}
        handleChange={handleChange}
      >
        <StyledSectionNavItem data-test="section-item" {...otherProps}>
          <PageNav section={section} questionnaire={questionnaire} />
        </StyledSectionNavItem>
      </StyledSectionsAccordion>
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
