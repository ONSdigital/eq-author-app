import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

import BaseTabs from "components/BaseTabs";
import { colors } from "constants/theme";

import ContentWrapper from "./ContentWrapper";
import TabList from "./TabList";

const TabsItem = styled.li`
  margin: 0;
  padding: 0;
`;

const tabBtnSelected = css`
  --color-text: ${colors.black};
  background: ${colors.orange};
  pointer-events: none;
  &::before {
    filter: invert(80%);
  }
`;

const TabsBtn = styled.button`
  --color-text: ${colors.darkGrey};
  color: var(--color-text);
  margin: 0;
  padding: 0.5em 2em;
  appearance: none;
  font-size: 1em;
  width: 100%;
  display: block;
  border: none;
  background: rgba(0, 0, 0, 0);
  text-align: left;
  cursor: pointer;

  &:hover {
    --color-text: ${colors.white};
    background: ${colors.secondary};
  }

  &:focus {
    outline: 3px solid ${colors.orange};
    outline-offset: -3px;
  }

  &:active {
    outline: none;
  }

  ${({ isSelected }) => isSelected && tabBtnSelected};
`;

const buttonRender = (options, item) => {
  const { onClick, ...rest } = options;
  return (
    <TabsItem {...rest}>
      <TabsBtn onClick={onClick} isSelected={item.isSelected}>
        {item.title}
      </TabsBtn>
    </TabsItem>
  );
};

const Tabs = ({ activeTabId, onChange, onClose, navItems, title }) => (
  <BaseTabs
    activeId={activeTabId}
    onChange={onChange}
    buttonRender={buttonRender}
    ContentWrapper={({ children }) => (
      <ContentWrapper onClose={onClose}>{children}</ContentWrapper>
    )}
    TabList={({ children }) => <TabList title={title}>{children}</TabList>}
    tabs={navItems}
  />
);

Tabs.propTypes = {
  activeTabId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired
    })
  )
};

export default Tabs;
