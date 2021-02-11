import styled, { css } from "styled-components";
import { colors } from "constants/theme";

import PropTypes from "prop-types";
import { propTypes } from "./propTypes";

export const logicBadge = css`
  border-radius: 0.7em;
  border: 1px solid ${colors.white};
  color: white;
  padding: 0.15em 0.3em;
  margin-left: auto;
  line-height: 1;
  font-size: 0.9rem;
  height: 1.4em;
`;

export const navBadge = css`
  border-radius: 0.7em;
  color: white;
  padding: 0.2em 0.4em;
  margin-left: auto;
  line-height: 1;
  font-size: 0.9rem;
  height: 20px;
`;

export const navSmallBadge = css`
  border-radius: 50%;
  display: inline-flex;
  width: 0.75em;
  height: 0.75em;
  margin: 0;
  padding: 0;
`;

export const mainNavSmallBadge = css`
  border-radius: 50%;
  border: 1px solid ${colors.white};
  width: 0.75em;
  height: 0.75em;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 2px;
  right: 2px;
`;

export const tabsSmallBadge = css`
  border-radius: 50%;
  border: 1px solid ${colors.white};
  display: inline-flex;
  width: 0.75em;
  height: 0.75em;
  margin: 0 5px 0 0;
  padding: 0;
`;

const Badge = styled.span`
  background-color: ${colors.red};
  font-weight: normal;
  z-index: 2;
  pointer-events: none;

  ${props => props.variant === "logic" && logicBadge};
  ${props => props.variant === "nav" && navBadge};
  ${props => props.variant === "nav-small" && navSmallBadge};
  ${props => props.variant === "main-nav-small" && mainNavSmallBadge};
  ${props => props.variant === "tabs-small" && tabsSmallBadge};
`;

Badge.propTypes = {
  ...propTypes,
  type: PropTypes.oneOf(["badge"]),
};

Badge.defaultProps = {
  type: "badge",
  variant: "logic",
};

export default Badge;
