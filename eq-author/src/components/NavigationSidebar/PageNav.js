import React from "react";
import styled from "styled-components";

import CustomPropTypes from "custom-prop-types";
import { TransitionGroup } from "react-transition-group";
import NavItemTransition from "./NavItemTransition";

import PageNavItem from "./PageNavItem";
import scrollIntoView from "utils/scrollIntoView";
import gql from "graphql-tag";

const NavList = styled.ol`
  padding: 0 0 1em;
  margin: 0;
  list-style: none;
  font-weight: normal;
`;

const PageNav = ({ section, questionnaire }) => (
  <TransitionGroup component={NavList}>
    {section.pages.map(page => (
      <NavItemTransition key={page.id} onEntered={scrollIntoView}>
        <PageNavItem
          page={page}
          sectionId={section.id}
          questionnaireId={questionnaire.id}
        />
      </NavItemTransition>
    ))}
  </TransitionGroup>
);

PageNav.fragments = {
  PageNav: gql`
    fragment PageNav on Section {
      id
      pages {
        ...PageNavItem
      }
    }
    ${PageNavItem.fragments.PageNavItem}
  `
};

PageNav.propTypes = {
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  section: CustomPropTypes.section.isRequired
};

export default PageNav;
