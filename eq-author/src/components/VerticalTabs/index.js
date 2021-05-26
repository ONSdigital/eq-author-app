import React from "react";
import PropTypes from "prop-types";
import Badge from "components/Badge";

import styled from "styled-components";
import { colors, disabledStyle, hoverStyle } from "constants/theme";

import { NavLink } from "react-router-dom";
import { Column } from "components/Grid";

const activeClassName = "active";

const Title = styled.h2`
  width: 100%;
  padding: 1em 1.2em;
  font-weight: bold;
  border-bottom: 1px solid ${colors.lightGrey};
  font-size: 1em;
  margin: 0;
`;

const StyledTabUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-left: -1px;
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

  &[aria-disabled="true"] {
    ${disabledStyle}
  }

  &:hover {
    ${hoverStyle}
  }

  &:active {
    outline: none;
  }

  &.${activeClassName} {
    --color-text: ${colors.white};

    background: ${colors.blue};
    border-left: 5px solid ${colors.orange};
    pointer-events: none;
  }
`;

const listItems = (tabItems) =>
  tabItems.map(({ url, title, disabled, errorCount }) => (
    <TabLink
      exact
      to={url}
      key={title}
      activeClassName="active"
      aria-disabled={disabled}
    >
      {title}
      {errorCount > 0 && (
        <Badge variant="logic" data-test={`errorBadge-${title}`}>
          {errorCount}
        </Badge>
      )}
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
  tabItems: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      errorCount: PropTypes.number,
    })
  ),
};

VerticalTabs.defaultProps = {
  gutters: false,
};

export default VerticalTabs;
