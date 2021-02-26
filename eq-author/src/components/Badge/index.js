import styled, { css } from "styled-components";
import { colors } from "constants/theme";

import { propTypes } from "./propTypes";

export const logicBadge = css`
  border: 1px solid ${colors.white};
  padding: 0.15em 0.3em;
  height: 1.4em;
`;

export const navBadge = css`
  padding: 0.2em 0.4em;
  height: 20px;
  display: ${(props) => (props.small ? `inline-flex` : ``)};
  margin-right: ${(props) => (props.small ? `0.3em` : ``)};
`;

export const mainNavBadge = css`
  border: 1px solid ${colors.white};
  margin: 0;
  position: absolute;
  top: 2px;
  right: 2px;
`;

export const tabsBadge = css`
  border: 1px solid ${colors.white};
  display: inline-flex;
  margin: 0 5px 0 0;
`;

export const smallBadge = css`
  width: 0.75em;
  height: 0.75em;
  padding: 0;
  border-radius: 50%;
`;

export const mediumBadge = css`
  border-radius: 0.7em;
  color: white;
  line-height: 1;
  margin-left: auto;
  font-size: 0.9rem;
`;

const Badge = styled.span`
  background-color: ${colors.red};
  font-weight: normal;
  z-index: 2;
  pointer-events: none;

  ${(props) => props.variant === "logic" && logicBadge};
  ${(props) => props.variant === "nav" && navBadge};
  ${(props) => props.variant === "main-nav" && mainNavBadge};
  ${(props) => props.variant === "tabs" && tabsBadge};
  ${(props) => props.small && smallBadge};
  ${(props) => props.medium && mediumBadge};
`;

Badge.propTypes = {
  ...propTypes,
};

Badge.defaultProps = {
  medium: "true",
};

export default Badge;
