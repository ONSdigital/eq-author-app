import { css } from "styled-components";

export const colors = {
  blue: "#3B7A9E",
  paleBlue: "#f0f1f9",
  lightBlue: "#61BDE0",
  mediumBlue: "#397596",
  darkBlue: "#5F7682",
  darkerBlue: "#003c57",
  grey: "#999999",
  darkGrey: "#666666",
  lightGrey: "#d6d8da",
  lightMediumGrey: "#E4E8EB",
  lighterGrey: "#f5f5f5",
  disabledGreyOnOrange: "#7A6340",
  red: "#D0021B",
  orange: "#FDBD56",
  amber: "#fe781f",
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

export const radius = "4px";

export const focusStyle = css`
  border-color: none;
  outline: 3px solid ${colors.tertiary};
  box-shadow: 0 0 0 3px ${colors.tertiary};
`;

export const disabledStyle = css`
  opacity: 0.6;
  pointer-events: none;
`;

export const hoverStyle = css`
  background: rgba(0, 0, 0, 0.2);
`;

export default {
  colors,
  radius,
};
