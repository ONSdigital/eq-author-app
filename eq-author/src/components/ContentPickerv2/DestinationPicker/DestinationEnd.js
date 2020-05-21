import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import {
  SectionTitle,
  SubMenuItem,
  MenuItemTitles,
  MenuItemTitle,
  MenuItemSubtitle,
} from "../Menu";

import IconPage from "./icon-page.svg?inline";

const EndTitle = styled(SectionTitle)`
  border-top: 1px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};
`;

const StyledMenuItemTitles = styled(MenuItemTitles)`
  display: flex;
  align-items: center;
`;

// eslint-disable-next-line no-unused-vars
export const Icon = styled(({ isActive, ...rest }) => <IconPage {...rest} />)`
  margin-right: 1em;
  .path {
    fill: ${props => (props.isActive ? "white" : colors.darkGrey)};
  }
`;

export const config = {
  id: "EndOfQuestionnaire",
  title: "End of questionnaire",
  config: {
    id: "EndOfQuestionnaire",
    title: "End of questionnaire",
    groupKey: "logicalDestinations",
    expandable: false,
    type: "RoutingLogicalDestination",
    destination: {
      logical: "EndOfQuestionnaire",
    },
  },
};

const DestinationEnd = ({ onSelected, isSelected, hideHeader }) => {
  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };

  const menuProps = {
    "aria-selected": isSelected(config),
    onClick: () => onSelected(config),
    tabIndex: 0,
    onKeyUp: event => onEnterUp(event, config),
  };

  return (
    <>
      {!hideHeader && <EndTitle>End of questionnaire</EndTitle>}
      <SubMenuItem {...menuProps}>
        <StyledMenuItemTitles>
          <Icon isActive={menuProps["aria-selected"]} />
          <div>
            <MenuItemTitle>End of questionnaire</MenuItemTitle>
            <MenuItemSubtitle>
              The user will be taken to the last page in the questionnaire.
            </MenuItemSubtitle>
          </div>
        </StyledMenuItemTitles>
      </SubMenuItem>
    </>
  );
};

DestinationEnd.propTypes = {
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool,
};

export default DestinationEnd;
