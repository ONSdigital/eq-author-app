import styled, { css } from "styled-components";
import { colors } from "constants/theme";

import { propTypes } from "./propTypes";

const logicBadge = css`
  border: 1px solid ${colors.white};
  padding: 0.15em 0.3em;
  height: 1.4em;
`;

const navBadge = css`
  padding: 0.2em 0.4em;
  height: 20px;
  display: ${(props) => (props.small ? `inline-flex` : ``)};
  margin-right: ${(props) => (props.small ? `0.3em` : ``)};
`;

const mainNavBadge = css`
  border-radius: 50%;
  border: 1px solid ${colors.white};
  margin: 0;
  position: absolute;
  top: 2px;
  right: 2px;
  padding: 0;
  width: 0.75em;
  height: 0.75em;
`;

const tabsBadge = css`
  border: 1px solid ${colors.white};
  display: inline-flex;
  margin: 0 5px 0 0;
`;

const smallBadge = css`
  width: 0.75em;
  height: 0.75em;
  padding: 0;
  border-radius: 50%;
`;

const mediumBadge = css`
  border-radius: 0.7em;
  line-height: 1;
  margin-left: auto;
  font-size: 0.9rem;
`;

const Badge = styled.div`
  background-color: ${colors.errorPrimary};
  color: ${colors.text};
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
  medium: true,
};

export default Badge;
