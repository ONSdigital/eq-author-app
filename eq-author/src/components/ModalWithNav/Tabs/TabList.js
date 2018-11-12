import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Column } from "components/Grid";
import { colors } from "constants/theme";

const Sidebar = styled.div`
  background: ${colors.lighterGrey};
  height: 100%;
`;

const SidebarHeader = styled.div`
  height: 4.3em;
  padding: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const SidebarTitle = styled.h2`
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.9em;
  margin: 0;
  text-align: center;
  color: ${colors.text};
`;

const ChildList = styled.ul`
  list-style: none;
  margin: 0 0 1em;
  padding: 0;
`;

const TabList = ({ title, children }) => (
  <Column cols={3} gutters={false}>
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle data-test="sidebar-title">{title}</SidebarTitle>
      </SidebarHeader>
      <ChildList>{children}</ChildList>
    </Sidebar>
  </Column>
);

TabList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default TabList;
