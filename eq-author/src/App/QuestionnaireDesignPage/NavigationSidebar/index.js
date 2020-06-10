import React, { useReducer, useEffect } from "react";
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
  margin: 1em 0 0.425em 1.8em;
  border: 1px solid white;
  top: 1px; /* adjust for misalignment caused by PopoutContainer */
  padding: 0.5em;
`;

const proptypes = {
  UnwrappedNavigationSidebar: {
    questionnaire: CustomPropTypes.questionnaire,
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired,
    canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
    canAddQuestionPage: PropTypes.bool.isRequired,
  },
};

const initialState = { label: true, controlGroup: [] };

const actionTypes = {
  updateGroup: "updateControlGroup",
  toggleLabel: "toggleLabel",
  toggleAll: "toggleAllAccordions",
  setInitial: "setInitialControlGroup",
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.updateGroup: {
      const { identity } = action.payload;
      const updateAccordionState = state.controlGroup
        .filter(x => x.identity !== identity)
        .concat({ identity, isOpen: !action.payload.isOpen });

      const allOpen = updateAccordionState.every(x => x.isOpen === false);
      return { controlGroup: updateAccordionState, label: allOpen };
    }
    case actionTypes.toggleAll: {
      const toggleAll = state.controlGroup.map(x => ({
        identity: x.identity,
        isOpen: state.label,
      }));

      return { label: !state.label, controlGroup: toggleAll };
    }
    case actionTypes.setInitial: {
      return { label: true, controlGroup: action.payload };
    }
    default:
      throw new Error(`${action.type} isn't a valid dispatch type`);
  }
}

export const UnwrappedNavigationSidebar = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    questionnaire,
    onAddQuestionPage,
    onAddSection,
    onAddCalculatedSummaryPage,
    onAddQuestionConfirmation,
    canAddQuestionConfirmation,
    canAddCalculatedSummaryPage,
    canAddQuestionPage,
    loading,
  } = props;

  useEffect(() => {
    if (questionnaire) {
      const accordions = questionnaire.sections.map((x, index) => ({
        identity: index,
        isOpen: false,
      }));
      dispatch({ type: actionTypes.setInitial, payload: accordions });
    }
  }, [questionnaire]);

  const handleAddSection = () => {
    onAddSection(questionnaire.id);
  };

  const handleClick = () => {
    dispatch({ type: actionTypes.toggleAll });
  };

  const handleAccordionChange = e => {
    dispatch({ type: actionTypes.updateGroup, payload: e });
  };

  return (
    <Container data-test="side-nav">
      {loading ? null : (
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
          <NavigationScrollPane>
            <NavList>
              <AccordionGroupToggle
                onClick={() => handleClick()}
                data-test="toggle-all-accordions"
              >
                {state.label ? "Close all" : "Open all"}
              </AccordionGroupToggle>
              {questionnaire.introduction && (
                <IntroductionNavItem
                  questionnaire={questionnaire}
                  data-test="nav-introduction"
                />
              )}
              <li>
                <SectionNav
                  questionnaire={questionnaire}
                  controlGroup={state.controlGroup}
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
