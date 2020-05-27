import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";

import { buildIntroductionPath } from "utils/UrlUtils";
import NavLink from "./NavLink";
import PageIcon from "./icon-survey-intro.svg?inline";

const StyledItem = styled.li`
  padding: 0;
  margin: 0 0 0.5em;
  position: relative;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const StyledNavLink = styled(NavLink)`
  padding-left: 2em;
`;

export const UnwrappedIntroductionNavItem = ({
  questionnaire,
  match,
  ...otherProps
}) => (
  <StyledItem data-test="page-item" {...otherProps}>
    <StyledNavLink
      to={buildIntroductionPath({
        questionnaireId: questionnaire.id,
        introductionId: questionnaire.introduction.id,
        tab: match.params.tab,
      })}
      title="Introduction"
      icon={PageIcon}
      data-test="nav-introduction-link"
    >
      Introduction
    </StyledNavLink>
  </StyledItem>
);

UnwrappedIntroductionNavItem.fragments = {
  IntroductionNavItem: gql`
    fragment IntroductionNavItem on Questionnaire {
      id
      introduction {
        id
      }
    }
  `,
};

UnwrappedIntroductionNavItem.propTypes = {
  questionnaire: propType(
    UnwrappedIntroductionNavItem.fragments.IntroductionNavItem
  ),
  match: CustomPropTypes.match.isRequired,
};

export default withRouter(UnwrappedIntroductionNavItem);
