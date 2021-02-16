import React, { useReducer, useCallback, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";

import { colors } from "constants/theme";
import { flowRight } from "lodash";
import { withRouter } from "react-router-dom";

import SectionNav from "./SectionNav";
import NavigationHeader from "./NavigationHeader";
import IntroductionNavItem from "./IntroductionNavItem";

import Button from "components/buttons/Button";
import ScrollPane from "components/ScrollPane";

const Container = styled.div`
  background: ${colors.black};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavigationScrollPane = styled(ScrollPane)`
  float: left;
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${colors.lightGrey};
    }
  }
`;

const NavList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const AccordionGroupToggle = styled(Button).attrs({
  variant: "tertiary-light",
  small: true,
})`
  margin: 0.425em 0 0.425em 1.8em;
  border: 1px solid white;
  top: 1px; /* adjust for misalignment caused by PopoutContainer */
  padding: 0.5em;
  align-self: baseline;
  font-size: 0.9em;

  &:focus {
    outline: 3px solid #fdbd56;
    outline-offset: -3px;
  }
`;

const proptypes = {
  UnwrappedNavigationSidebar: {
    questionnaire: CustomPropTypes.questionnaire,
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired,
    canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
    canAddQuestionPage: PropTypes.bool.isRequired,
  },
};

export const sidebarActionTypes = {
  toggleLabel: "toggleLabel",
  handleClick: "handleClick",
};

export const sidebarReducer = (state, action) => {
  const { toggleLabel, handleClick } = sidebarActionTypes;
  switch (action.type) {
    case toggleLabel: {
      return { ...state, label: !state.label };
    }
    case handleClick: {
      const toOpen = !state.label ? { open: true } : { open: false };
      return { label: !state.label, isOpen: toOpen };
    }
    default:
      throw new Error(`${action.type} is not a valid dispatch type`);
  }
};

export const accordionActionTypes = {
  create: "create",
  update: "update",
  createAndUpdate: "createAndUpdate",
};

export const accordionGroupReducer = (array, action) => {
  const { create, update, createAndUpdate } = accordionActionTypes;
  switch (action.type) {
    case create: {
      const { isOpen } = action.payload;
      return array.map((item, index) => ({
        isOpen: isOpen,
        id: index,
      }));
    }
    case update: {
      const { event } = action.payload;
      return array.filter((item) => item.id !== event.id).concat(event);
    }
    case createAndUpdate: {
      const { isOpen, event } = action.payload;
      return array
        .map((item, index) => ({
          isOpen: isOpen,
          id: index,
        }))
        .filter((item) => item.id !== event.id)
        .concat(event);
    }
    default:
      throw new Error(`${action.type} is not a valid type`);
  }
};

const sidebarInitialState = {
  label: true,
  isOpen: { open: true },
};

export const UnwrappedNavigationSidebar = (props) => {
  const [state, dispatch] = useReducer(sidebarReducer, sidebarInitialState);

  let accordionsRef = useRef(null);

  const {
    questionnaire,
    onAddQuestionPage,
    onAddSection,
    onAddCalculatedSummaryPage,
    onAddQuestionConfirmation,
    canAddQuestionConfirmation,
    canAddCalculatedSummaryPage,
    canAddQuestionPage,
  } = props;

  const { label, isOpen } = state;

  const handleAddSection = useCallback(() => {
    onAddSection(questionnaire.id);
  }, [questionnaire]);

  const handleClick = () => {
    const accordions = accordionGroupReducer(questionnaire.sections, {
      type: accordionActionTypes.create,
      payload: { isOpen: !state.label },
    });

    accordionsRef.current = accordions;

    dispatch({ type: sidebarActionTypes.handleClick });
  };

  const handleAccordionChange = (event) => {
    let accordions;

    if (accordionsRef.current) {
      accordions = accordionGroupReducer(accordionsRef.current, {
        type: accordionActionTypes.update,
        payload: { event },
      });
    } else {
      accordions = accordionGroupReducer(questionnaire.sections, {
        type: accordionActionTypes.createAndUpdate,
        payload: {
          event,
          isOpen: true,
        },
      });
    }

    accordionsRef.current = accordions;

    const allOpen = accordionsRef.current.every((item) => item.isOpen === true);

    if (allOpen !== state.label) {
      dispatch({
        type: sidebarActionTypes.toggleLabel,
      });
    }
  };

  return (
    <Container data-test="side-nav">
      {!questionnaire ? null : (
        <>
          <NavigationHeader
            questionnaire={questionnaire}
            onAddSection={handleAddSection}
            onAddCalculatedSummaryPage={onAddCalculatedSummaryPage}
            canAddCalculatedSummaryPage={canAddCalculatedSummaryPage}
            onAddQuestionPage={onAddQuestionPage}
            canAddQuestionPage={canAddQuestionPage}
            onAddQuestionConfirmation={onAddQuestionConfirmation}
            canAddQuestionConfirmation={canAddQuestionConfirmation}
            data-test="nav-section-header"
          />
          <AccordionGroupToggle
            onClick={() => handleClick()}
            data-test="toggle-all-accordions"
          >
            {label ? "Close all" : "Open all"}
          </AccordionGroupToggle>
          <NavigationScrollPane>
            <NavList>
              {questionnaire.introduction && (
                <IntroductionNavItem
                  questionnaire={questionnaire}
                  data-test="nav-introduction"
                />
              )}
              <li>
                <SectionNav
                  questionnaire={questionnaire}
                  isOpen={isOpen}
                  handleChange={handleAccordionChange}
                />
              </li>
            </NavList>
          </NavigationScrollPane>
        </>
      )}
    </Container>
  );
};

UnwrappedNavigationSidebar.propTypes = proptypes.UnwrappedNavigationSidebar;

UnwrappedNavigationSidebar.fragments = {
  NavigationSidebar: gql`
    fragment NavigationSidebar on Questionnaire {
      id
      ...SectionNav
      ...NavigationHeader
      ...IntroductionNavItem
    }

    ${NavigationHeader.fragments.NavigationHeader}
    ${SectionNav.fragments.SectionNav}
    ${IntroductionNavItem.fragments.IntroductionNavItem}
  `,
};

export default flowRight(withRouter)(UnwrappedNavigationSidebar);
