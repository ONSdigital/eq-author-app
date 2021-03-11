import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";

import { NavLink } from "react-router-dom";
import { Column } from "components/Grid";

export const Title = styled.div`
  width: 100%;
  padding: 1em 1.2em;
  font-weight: bold;
  border-bottom: 1px solid ${colors.lightGrey};
`;

export const StyledTabUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export const TabLink = styled(NavLink)`
  --color-text: ${colors.black};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  color: var(--color-text);
  font-size: 1em;
  border-left: 5px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};

  &:hover {
    background: ${rgba(0, 0, 0, 0.2)};
  }

  &:active {
    outline: none;
  }
`;

const VerticalTabs = ({ title, gutters, cols }) => {
  return (
    <Column gutters={gutters} cols={cols}>
      <Title>{title}</Title>
      <StyledTabUl>
        <TabLink exact to="#">
          General
        </TabLink>
        <TabLink exact to="#">
          Themes, IDs and form types
        </TabLink>
      </StyledTabUl>
    </Column>
  );
};

VerticalTabs.propTypes = {
  title: PropTypes.string.isRequired,
  gutters: PropTypes.bool,
  cols: PropTypes.number.isRequired,
};

VerticalTabs.defaultProps = {
  gutters: false,
};

export default VerticalTabs;
