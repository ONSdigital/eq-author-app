import React, { useCallback } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import { get } from "lodash";

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

const SmallBadge = styled.span`
  border-radius: 50%;
  background-color: ${colors.red};
  border: 1px solid ${colors.white};
  font-weight: normal;
  z-index: 2;
  display: inline-flex;
  pointer-events: none;
  width: 0.75em;
  height: 0.75em;
  margin: 0 5px 0 0;
  padding: 0;
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
    isActive: (match, location) => {
      if (
        location.pathname.includes("routing") ||
        location.pathname.includes("skip")
      ) {
        return true;
      }
      return false;
    },
  },
];

export const UnwrappedTabs = props => {
  const { match, validationErrorInfo, page, section } = props;
  const tabErrors = useCallback(
    tabKey => {
      if (validationErrorInfo === null || validationErrorInfo === undefined) {
        return null;
      }
      const errorsPerTab = {
        design: [],
        logic: [],
        section: [],
      };
      const { errors } = validationErrorInfo;
      const errorSeparator = errors.reduce((accumulator, error) => {
        const { design, logic } = accumulator;
        error.id.includes("expression")
          ? logic.push(error)
          : design.push(error);
        return accumulator;
      }, errorsPerTab);
      return errorSeparator[tabKey];
    },
    [validationErrorInfo]
  );

  return (
    <div>
      <TabsContainer data-test="tabs-nav">
        {TABS.map(({ key, children, url, isActive }) => {
          const errors = tabErrors(key);
          const { Component, otherProps = {} } = props[key]
            ? {
                Component: Tab,
                otherProps: { to: url(match), activeClassName, isActive },
              }
            : { Component: DisabledTab };
          return (
            <Component data-test={key} key={key} {...otherProps}>
              {errors !== undefined && errors !== null && errors.length > 0 ? (
                <SmallBadge data-test="small-badge" />
              ) : null}
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
  page: CustomPropTypes.page,
  validationErrorInfo: CustomPropTypes.validationErrorInfo,
};

export default withRouter(UnwrappedTabs);
