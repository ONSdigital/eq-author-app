import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";

import { NavLink } from "react-router-dom";
import { Column } from "components/Grid";

const activeClassName = "active";

const Title = styled.div`
  width: 100%;
  padding: 1em 1.2em;
  font-weight: bold;
  border-bottom: 1px solid ${colors.lightGrey};
`;

const StyledTabUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const TabLink = styled(NavLink)`
  --color-text: ${colors.black};
  background: ${colors.white};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  color: var(--color-text);
  font-size: 1em;
  border-left: 5px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};
  pointer-events: auto;

  &:hover {
    background: ${rgba(0, 0, 0, 0.2)};
  }

  &:active {
    outline: none;
  }

  &:disabled {
    background: red;
  }

  &.${activeClassName} {
    --color-text: ${colors.white};

    background: ${colors.blue};
    border-left: 5px solid ${colors.orange};
    pointer-events: none;
  }
`;

const listItems = (tabItems) =>
  tabItems.map(({ url, title, disabled }) => (
    <TabLink
      exact
      to={url}
      key={title}
      activeClassName="active"
      disabled={disabled}
    >
      {console.log(disabled)}
      {title}
    </TabLink>
  ));

const VerticalTabs = ({ title, gutters, cols, tabItems }) => {
  return (
    <Column gutters={gutters} cols={cols} tabItems={tabItems}>
      <Title>{title}</Title>
      <StyledTabUl>{listItems(tabItems)}</StyledTabUl>
    </Column>
  );
};

VerticalTabs.propTypes = {
  title: PropTypes.string.isRequired,
  gutters: PropTypes.bool,
  cols: PropTypes.number.isRequired,
  tabItems: PropTypes.array.isRequired, // eslint-disable-line
};

VerticalTabs.defaultProps = {
  gutters: false,
};

export default VerticalTabs;
