import styled from "styled-components";

import { colors } from "constants/theme";

export const LogicBadge = styled.span`
  border-radius: 0.7em;
  border: 1px solid ${colors.white};
  background-color: ${colors.red};
  color: white;
  padding: 0.15em 0.3em;
  font-weight: normal;
  z-index: 2;
  margin-left: auto;
  line-height: 1;
  font-size: 0.9rem;
  pointer-events: none;
  height: 1.4em;
`;

export const NavBadge = styled.span`
  border-radius: 0.7em;
  background-color: ${colors.red};
  color: white;
  padding: 0.2em 0.4em;
  font-weight: normal;
  z-index: 2;
  margin-left: auto;
  line-height: 1;
  font-size: 0.9rem;
  pointer-events: none;
  height: 20px;
`;

export const NavSmallBadge = styled.span`
  border-radius: 50%;
  background-color: ${colors.red};
  font-weight: normal;
  z-index: 2;
  display: inline-flex;
  pointer-events: none;
  width: 0.75em;
  height: 0.75em;
  margin: 0;
  padding: 0;
`;

export const MainNavSmallBadge = styled.span`
  border-radius: 50%;
  background-color: ${colors.red};
  border: 1px solid ${colors.white};
  font-weight: normal;
  z-index: 2;
  pointer-events: none;
  width: 0.75em;
  height: 0.75em;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 2px;
  right: 2px;
`;

export const TabsSmallBadge = styled.span`
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
