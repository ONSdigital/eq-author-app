import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

import { colors } from "constants/theme";
import CustomPropTypes from "custom-prop-types";
import {
  buildPreviewPath,
  buildDesignPath,
  buildLogicPath,
} from "utils/UrlUtils";

export const activeClassName = "active";

const TabsContainer = styled.nav`
  display: flex;
  background: ${colors.primary};
  padding: 0 1em;
`;

export const Tab = styled(NavLink)`
  --color-text: ${colors.white};
  font-size: 1em;
  font-weight: bold;
  color: var(--color-text);
  padding: 0.5em;
  text-decoration: none;
  border-bottom: 5px solid rgb(255, 255, 255, 0);

  transition: opacity 300ms ease-in-out;

  &.${activeClassName} {
    border-bottom: 5px solid rgb(255, 255, 255, 1);
  }

  &:focus {
    outline: 3px solid ${colors.orange};
  }
`;

const DisabledTab = styled(Tab.withComponent("span"))`
  opacity: 0.2;
`;

const TABS = [
  {
    key: "design",
    children: "Design",
    url: match => buildDesignPath(match.params),
  },
  {
    key: "preview",
    children: "Preview",
    url: match => buildPreviewPath(match.params),
  },
  {
    key: "logic",
    children: "Logic",
    url: match => buildLogicPath(match.params),
  },
];

export const UnwrappedTabs = props => {
  const { match } = props;
  return (
    <div>
      <TabsContainer data-test="tabs-nav">
        {TABS.map(({ key, children, url }) => {
          const { Component, otherProps = {} } = props[key]
            ? {
                Component: Tab,
                otherProps: { to: url(match), activeClassName },
              }
            : { Component: DisabledTab };

          return (
            <Component data-test={key} key={key} {...otherProps}>
              {children}
            </Component>
          );
        })}
      </TabsContainer>
    </div>
  );
};

UnwrappedTabs.defaultProps = {
  design: true,
  preview: false,
  logic: false,
};

UnwrappedTabs.propTypes = {
  design: PropTypes.bool,
  preview: PropTypes.bool,
  logic: PropTypes.bool,
  match: CustomPropTypes.match.isRequired,
};

export default withRouter(UnwrappedTabs);
