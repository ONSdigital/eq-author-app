import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

import IconText from "components/IconText";
import { colors, radius } from "constants/theme";
import CustomPropTypes from "custom-prop-types";
import {
  buildPagePath,
  buildSectionPath,
  buildRoutingPath,
  buildPreviewPath,
  buildConfirmationPath
} from "utils/UrlUtils";

import IconPreview from "./icon-preview.svg?inline";
import IconDesign from "./icon-design.svg?inline";
import IconRouting from "./icon-route.svg?inline";

export const activeClassName = "active";

export const TabsContainer = styled.nav`
  display: flex;
  justify-content: center;
  padding: 0;
  position: relative;
  bottom: -1px;
`;

export const Tab = styled(NavLink)`
  --color-text: ${colors.white};

  font-size: 1em;
  font-weight: bold;
  color: var(--color-text);
  padding: 0 0.4em 0 0.2em;
  border: 1px solid ${colors.secondary};
  border-bottom: none;
  background-color: ${colors.secondary};
  text-decoration: none;
  border-radius: ${radius} ${radius} 0 0;
  margin: 0 0.25em 0 0;

  &.${activeClassName} {
    --color-text: ${colors.secondary};
    background: ${colors.white};
    border: 1px solid ${colors.bordersLight};
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${colors.orange};
  }
`;

const TabsBody = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.bordersLight};
  border-radius: ${radius};
`;

const DisabledTab = styled(Tab.withComponent("span"))`
  opacity: 0.5;
  color: ${colors.lightGrey};
`;

const isOnConfirmation = match => Boolean(match.params.confirmationId);
const isOnPage = match => Boolean(match.params.pageId) && !isOnConfirmation(match);

const TABS = [
  {
    key: "design",
    children: <IconText icon={IconDesign}>Design</IconText>,
    url: (match) => {
      if (isOnConfirmation(match)) {
        return buildConfirmationPath(match.params);
      }
      if (isOnPage(match)) {
        return buildPagePath(match.params);
      }
      return buildSectionPath(match.params)
    },
    enabled: () => true
  },
  {
    key: "preview",
    children: <IconText icon={IconPreview}>Preview</IconText>,
    url: match => buildPreviewPath(match.params),
    enabled: isOnPage
  },
  {
    key: "routing",
    children: <IconText icon={IconRouting}>Routing</IconText>,
    url: match => buildRoutingPath(match.params),
    enabled: isOnPage
  }
];

export const UnwrappedTabs = props => {
  const { match, children } = props;
  return (
    <div>
      <TabsContainer data-test="tabs-nav">
        {TABS.map(({ key, children, url, enabled }) => {
          const { Component, props } = enabled(match)
            ? {
                Component: Tab,
                props: { to: url(match), activeClassName }
              }
            : {
                Component: DisabledTab,
                props: {}
              };

          return (
            <Component key={key} {...props}>
              {children}
            </Component>
          );
        })}
      </TabsContainer>
      <TabsBody data-test="tabs-body">{children}</TabsBody>
    </div>
  );
};

UnwrappedTabs.propTypes = {
  match: CustomPropTypes.match,
  children: PropTypes.node.isRequired
};

export default withRouter(UnwrappedTabs);
