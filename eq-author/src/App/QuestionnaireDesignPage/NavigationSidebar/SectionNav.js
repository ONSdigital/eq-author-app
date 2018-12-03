import React, { Component } from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { TransitionGroup } from "react-transition-group";
import NavItemTransition from "./NavItemTransition";
import SectionNavItem from "./SectionNavItem";
import scrollIntoView from "utils/scrollIntoView";
import gql from "graphql-tag";
import NavLink from "./NavLink";
import PageIcon from "./icon-survey-intro.svg?inline";
import { buildQuestionnaireIntroPath } from "utils/UrlUtils";
import { last } from "lodash";
import { withRouter } from "react-router-dom";

const NavList = styled.ol`
  margin: 0 0 1em;
  padding: 0;
  list-style: none;
  font-weight: bold;
`;

class SectionNav extends Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire
  };

  render() {
    const { questionnaire, match } = this.props;

    return (
      <TransitionGroup component={NavList}>
        <NavItemTransition key="survey-intro" onEntered={scrollIntoView}>
          <NavLink
            to={buildQuestionnaireIntroPath({
              questionnaireId: questionnaire.id,
              introductionId: "introduction",
              tab: last(document.location.hash.split("/"))
            })}
            title="Intro"
            icon={PageIcon}
          >
            Questionnaire intro
          </NavLink>
        </NavItemTransition>

        {questionnaire.sections.map(section => (
          <NavItemTransition key={section.id} onEntered={scrollIntoView}>
            <SectionNavItem questionnaire={questionnaire} section={section} />
          </NavItemTransition>
        ))}
      </TransitionGroup>
    );
  }
}

SectionNav.fragments = {
  SectionNav: gql`
    fragment SectionNav on Questionnaire {
      id
      sections {
        ...SectionNavItem
      }
    }
    ${SectionNavItem.fragments.SectionNavItem}
  `
};

export default withRouter(SectionNav);
