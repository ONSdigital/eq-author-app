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
  --color-text: ${(props) =>
    props.active ? `${colors.white}` : `${colors.black}`};
  background: ${(props) =>
    props.active ? `${colors.blue}` : `${colors.white}`};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  color: var(--color-text);
  font-size: 1em;
  border-left: ${(props) =>
    props.active
      ? `5px solid ${colors.orange}`
      : `5px solid ${colors.lightGrey}`};
  border-bottom: 1px solid ${colors.lightGrey};
  pointer-events: ${(props) => (props.active ? `none` : `auto`)};

  &:hover {
    background: ${rgba(0, 0, 0, 0.2)};
  }

  &:active {
    outline: none;
  }
`;

const listItems = (tabItems) =>
  tabItems.map((item) => (
    <TabLink exact to={item.url} key={item.title} active={item.active}>
      {item.title}
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
