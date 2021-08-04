import { css } from "styled-components";
import { darken } from "polished";

export const colors = {
  blue: "#3B7A9E",
  paleBlue: "#f0f1f9",
  lightBlue: "#61BDE0",
  highlightBlue: "#195673",
  mediumBlue: "#397596",
  darkBlue: "#5F7682",
  darkerBlue: "#003c57",
  grey: "#999999",
  darkGrey: "#666666",
  lightGrey: "#d6d8da",
  lightMediumGrey: "#E4E8EB",
  mediumGrey: "#7a7a7a",
  lighterGrey: "#f5f5f5",
  disabledGreyOnOrange: "#7A6340",
  red: "#D0021B",
  lightOrange: "#FFDFCD",
  orange: "#FDBD56",
  amber: "#fe781f",
  darkOrange: "#FF600A",
  lightGreen: " #EDF4F0",
  green: "#0f8243",
  highlightGreen: "#dce5b0",
  black: "#333333",
  darkerBlack: "#222222",
  white: "#FFFFFF",
  greyedOrange: "#D9A551",
};

colors.primary = colors.blue;
colors.secondary = colors.blue;
colors.tertiary = colors.orange;
colors.positive = colors.green;
colors.negative = colors.red;
colors.text = colors.black;
colors.textLight = colors.darkGrey;
colors.borders = colors.grey;
colors.bordersLight = colors.lightGrey;
colors.previewError = colors.grey;
colors.errorPrimary = colors.darkOrange;
colors.errorSecondary = colors.lightOrange;
colors.badgeSelectedBackground = colors.darkerBlack;
colors.badgeSelectedText = colors.white;

export const radius = "4px";

export const focusStyle = `
  border-color: transparent;
  outline: 3px solid ${colors.tertiary};
  box-shadow: 0 0 0 3px ${colors.tertiary};
`;

export const disabledStyle = css`
  opacity: 0.6;
  pointer-events: none;
`;

export const activeNavItemStyle = css`
  background: ${colors.orange};
  outline: none;
  cursor: default;

  &:hover {
    background: ${colors.orange};
  }

  p,
  span {
    color: ${colors.black};
  }
  div {
    background-color: ${colors.badgeSelectedBackground};
    color: ${colors.badgeSelectedText};
  }

  > svg {
    path {
      fill: ${colors.black};
    }
  }
`;

export const hoverStyle = css`
  background: rgba(0, 0, 0, 0.2);
`;

export const getTextHoverStyle = (color) => css`
  &:hover {
    color: ${darken(0.1, color)};
  }
`;

export default {
  colors,
  radius,
};
