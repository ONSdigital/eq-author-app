import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";

import { NavLink } from "react-router-dom";
import { Column } from "components/Grid";

class VerticalTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: 0 };
  }
  render() {
    const { title, gutters, cols, tabItems } = this.props;

    // const handleClick = (id) => this.setState({ active: id });

    return (
      <Column gutters={gutters} cols={cols} tabItems={tabItems}>
        <Title>{title}</Title>
        <StyledTabUl>{listItems(tabItems)}</StyledTabUl>
      </Column>
    );
  }
}

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

const listItems = (tabItems) =>
  tabItems.map((item) => (
    <TabLink exact to={item.url} key={item.title}>
      {item.title}
    </TabLink>
  ));

VerticalTabs.propTypes = {
  title: PropTypes.string.isRequired,
  gutters: PropTypes.bool,
  cols: PropTypes.number.isRequired,
  tabItems: PropTypes.array.isRequired, // eslint-disable-line
  active: PropTypes.bool.isRequired,
};

VerticalTabs.defaultProps = {
  gutters: false,
};

export default VerticalTabs;
