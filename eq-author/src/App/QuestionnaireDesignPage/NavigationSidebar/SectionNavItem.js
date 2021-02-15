import React, { useCallback } from "react";
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

const propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  section: CustomPropTypes.section.isRequired,
  match: CustomPropTypes.match.isRequired,
  isOpen: PropTypes.shape({ open: PropTypes.bool }).isRequired,
  handleChange: PropTypes.func.isRequired,
  identity: PropTypes.number.isRequired,
};

export const UnwrappedSectionNavItem = (props) => {
  const {
    questionnaire,
    section,
    match,
    isOpen,
    handleChange,
    identity,
    ...otherProps
  } = props;

  const url = useCallback(() => {
    return buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: section.id,
      tab: match.params.tab,
    });
  }, [questionnaire, match]);

  let questionErrorCount = 0;

  section.folders.map(({ pages }) =>
    pages.map((item) => {
      questionErrorCount =
        questionErrorCount + item.validationErrorInfo.totalCount;
      return questionErrorCount;
    })
  );

  const SectionTitle = useCallback(
    (isOpen) => (
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
          id={section.displayName}
          errorCount={section.validationErrorInfo.totalCount}
          sectionTotalErrors={questionErrorCount}
          isSection
          isOpen={isOpen}
        >
          <SectionNameOuter>{section.displayName}</SectionNameOuter>
        </NavLink>
        <StyledSectionLower>
          <div />
        </StyledSectionLower>
      </>
    ),
    [section, url, isOpen]
  );

  return (
    <StyledSectionsAccordion
      title={SectionTitle}
      titleName={section.displayName}
      url={url}
      isOpen={isOpen}
      identity={identity}
      handleChange={handleChange}
    >
      <StyledSectionNavItem data-test="section-item" {...otherProps}>
        <PageNav section={section} questionnaire={questionnaire} />
      </StyledSectionNavItem>
    </StyledSectionsAccordion>
  );
};

UnwrappedSectionNavItem.propTypes = propTypes;

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
