import React, { Component } from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";

import { TransitionGroup } from "react-transition-group";
import NavItemTransition from "./NavItemTransition";
import SectionNavItem from "./SectionNavItem";
import scrollIntoView from "utils/scrollIntoView";
import gql from "graphql-tag";

const NavList = styled.ol`
  margin: 0 0 1em;
  padding: 0;
  list-style: none;
  font-weight: bold;
`;

class SectionNav extends Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    isOpen: PropTypes.bool.isRequired,
    handleChange: PropTypes.func,
  };

  render() {
    const { questionnaire, isOpen, handleChange } = this.props;

    return (
      <TransitionGroup component={NavList}>
        {questionnaire.sections.map((section, index) => (
          <NavItemTransition key={section.id} onEntered={scrollIntoView}>
            <SectionNavItem
              questionnaire={questionnaire}
              isOpen={isOpen}
              section={section}
              handleChange={handleChange}
              identity={index}
            />
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
  `,
};

export default SectionNav;
