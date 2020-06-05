import React from "react";
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

export const GroupOpenContext = React.createContext({ isOpen: true });

export const UnwrappedNavigationSidebar = props => {
  const [isOpen, setIsOpen] = React.useState(true);

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

  const handleAddSection = () => {
    onAddSection(questionnaire.id);
  };

  const handleClick = () => {
    setIsOpen(isOpen => !isOpen);
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
            <GroupOpenContext.Provider value={isOpen}>
              <NavList>
                <AccordionGroupToggle
                  onClick={() => handleClick()}
                  data-test="toggle-all-accordions"
                >
                  {isOpen ? "Close all" : "Open all"}
                </AccordionGroupToggle>
                {questionnaire.introduction && (
                  <IntroductionNavItem
                    questionnaire={questionnaire}
                    data-test="nav-introduction"
                  />
                )}
                <li>
                  <SectionNav questionnaire={questionnaire} />
                </li>
              </NavList>
            </GroupOpenContext.Provider>
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
