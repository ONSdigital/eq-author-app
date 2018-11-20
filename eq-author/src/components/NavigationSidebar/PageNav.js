import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";

import CustomPropTypes from "custom-prop-types";
import { TransitionGroup } from "react-transition-group";
import NavItemTransition from "./NavItemTransition";

import PageNavItem from "./PageNavItem";
import scrollIntoView from "utils/scrollIntoView";

import PageConfirmationNavItem from "./PageConfirmationNavItem";

const NavList = styled.ol`
  padding: 0 0 1em;
  margin: 0;
  list-style: none;
  font-weight: normal;
`;

const PageNav = ({ section, questionnaire }) => {
  const pages = section.pages
    .reduce((list, page) => [...list, page, page.confirmation], [])
    .filter(Boolean);

  return (
    <TransitionGroup component={NavList}>
      {pages.map((pageOrConfirmation, idx) => {
        if (pageOrConfirmation.__typename === "QuestionConfirmation") {
          const confirmation = pageOrConfirmation;
          return (
            <NavItemTransition
              key={`confirmation-${confirmation.id}`}
              onEntered={scrollIntoView}
            >
              <PageConfirmationNavItem
                confirmation={confirmation}
                page={pages[idx - 1]}
                sectionId={section.id}
                questionnaireId={questionnaire.id}
              />
            </NavItemTransition>
          );
        }
        const page = pageOrConfirmation;
        return (
          <NavItemTransition key={page.id} onEntered={scrollIntoView}>
            <PageNavItem
              page={page}
              sectionId={section.id}
              questionnaireId={questionnaire.id}
            />
          </NavItemTransition>
        );
      })}
    </TransitionGroup>
  );
};

PageNav.fragments = {
  PageNav: gql`
    fragment PageNav on Section {
      id
      pages {
        ...PageNavItem
        ...PageConfirmationNavItem
      }
    }
    ${PageNavItem.fragments.PageNavItem}
    ${PageConfirmationNavItem.fragments.PageConfirmationNavItem}
  `
};

PageNav.propTypes = {
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  section: CustomPropTypes.section.isRequired
};

export default PageNav;
