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
  lightGreen: "#EDF4F0",
  green: "#0f8243",
  highlightGreen: "#dce5b0",
  darkGreen: "#424344",
  black: "#222222",
  sidebarBlack: "#333333",
  white: "#FFFFFF",
  greyedOrange: "#D9A551",
  // ONS colour palette
  nightBlue: "#003c57",
  springGreen: "#a8bd3a",
  oceanBlue: "#206095",
  skyBlue: "#27a0cc",
  aquaTeal: "#00a3a6",
  blueLink: "#236198",
  leafGreen: "#0f8243",
  rubyRed: "#d0021b",
  jaffaOrange: "#fa6401",
  sunYellow: "#fbc900",
  neonYellow: "#f0f762",
  grey150: "#282b2b",
  grey100: "#414042",
  grey80: "#737373",
  grey75: "#707071",
  grey70: "#858587",
  grey35: "#bcbcbd",
  grey15: "#e2e2e3",
  grey6: "#f5f5f7",
  grey5: "#f5f5f6",
  infoTint: "#e9eff4",
  infoVibrant: "#1f84d8",
  successVibrant: "#10ca64",
  successTint: "#e7f3ec",
  errorsTint: "#fae6e8",
  errorsVibrant: "#fd112d",
  pendingVibrant: "#ff803b",
  infoGrey: "#e9eff4",
};

colors.primary = colors.blue;
colors.secondary = colors.blue;
colors.tertiary = colors.orange;
colors.focus = colors.sunYellow;
colors.positive = colors.green;
colors.negative = colors.red;
colors.text = colors.black;
colors.textInverse = colors.white;
colors.textLight = colors.darkGrey;
colors.borders = colors.grey;
colors.bordersLight = colors.lightGrey;
colors.previewError = colors.grey;
colors.errorPrimary = colors.darkOrange;
colors.errorSecondary = colors.lightOrange;
colors.badgeSelectedBackground = colors.black;
colors.badgeSelectedText = colors.white;
colors.calcSumEmptyContent = colors.mediumGrey;
colors.textLink = colors.oceanBlue;
colors.textLinkHover = colors.nightBlue;
colors.highlight = colors.neonYellow;
colors.info = colors.oceanBlue;
colors.success = colors.leafGreen;
colors.errors = colors.rubyRed;
colors.branded = colors.oceanBlue;
colors.commentHighlight = colors.darkGreen;

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

  #comment-notification {
    border-top: 1px solid ${({ theme }) => theme.colors.badgeSelectedBackground};
    border-bottom: 1px solid
      ${({ theme }) => theme.colors.badgeSelectedBackground};
    border-right: 2px solid
      ${({ theme }) => theme.colors.badgeSelectedBackground};
    border-left: 4px solid
      ${({ theme }) => theme.colors.badgeSelectedBackground};

    &::before {
      border-left: 6px solid
        ${({ theme }) => theme.colors.badgeSelectedBackground};
      border-top: 6px solid
        ${({ theme }) => theme.colors.badgeSelectedBackground};
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

export const themes = {
  default: {
    colors,
    radius,
    fonts: "Open Sans, Helvetica Neue, arial, sans-serif",
    fontSize: "16px",
  },
  ons: {
    colors: {
      ...colors,
      primary: colors.leafGreen,
      secondary: colors.grey15,
      tertiary: colors.jaffaOrange,
      focus: colors.sunYellow,
      positive: colors.leafGreen,
      negative: colors.rubyRed,
      text: colors.black,
      textInverse: colors.white,
      textLight: colors.grey75,
      borders: colors.grey75,
      bordersLight: colors.grey15,
      previewError: colors.grey100,
      errorPrimary: colors.rubyRed,
      errorSecondary: colors.errorsTint,
      badgeSelectedBackground: colors.black,
      badgeSelectedText: colors.blue,
      calcSumEmptyContent: colors.Grey50,
      textLink: colors.oceanBlue,
      textLinkHover: colors.nightBlue,
      highlight: colors.neonYellow,
      info: colors.oceanBlue,
      success: colors.leafGreen,
      errors: colors.rubyRed,
      internalHeaderTop: colors.darkerBlue,
      externalHeaderTop: colors.white,
      internalOnsLogo: colors.white,
      externalOnsLogo: colors.darkerBlue,
      headerMain: colors.oceanBlue,
      headerTitle: colors.white,
      colorInfoTint: colors.infoGrey,
      input: colors.black,
      textBannerLink: colors.grey5,
      onsLogoAccent: colors.springGreen,
      branded: colors.oceanBlue,
    },
    radius: "3px",
    fonts: "'Open Sans',Helvetica,'Helvetica Neue',arial,sans-serif",
    fontSize: "18px",
  },
  // TODO: onsLegacyFont can be removed once Author is compatible with fontSize 18px
  onsLegacyFont: {
    colors: {
      ...colors,
      primary: colors.leafGreen,
      secondary: colors.grey15,
      tertiary: colors.jaffaOrange,
      focus: colors.sunYellow,
      positive: colors.leafGreen,
      negative: colors.rubyRed,
      text: colors.black,
      textInverse: colors.white,
      textLight: colors.grey75,
      borders: colors.grey75,
      bordersLight: colors.grey15,
      previewError: colors.grey100,
      errorPrimary: colors.rubyRed,
      errorSecondary: colors.errorsTint,
      badgeSelectedBackground: colors.black,
      badgeSelectedText: colors.blue,
      calcSumEmptyContent: colors.Grey50,
      textLink: colors.oceanBlue,
      textLinkHover: colors.nightBlue,
      highlight: colors.neonYellow,
      info: colors.oceanBlue,
      success: colors.leafGreen,
      errors: colors.rubyRed,
      internalHeaderTop: colors.darkerBlue,
      externalHeaderTop: colors.white,
      internalOnsLogo: colors.white,
      externalOnsLogo: colors.darkerBlue,
      headerMain: colors.oceanBlue,
      headerTitle: colors.white,
      colorInfoTint: colors.infoGrey,
      input: colors.black,
      textBannerLink: colors.grey5,
      onsLogoAccent: colors.springGreen,
      branded: colors.oceanBlue,
      modalContainer: colors.white,
      modalBackground: colors.black,
      modalSubtitle: colors.oceanBlue,
    },
    radius: "3px",
    fonts: "'Open Sans',Helvetica,'Helvetica Neue',arial,sans-serif",
    fontSize: "16px",
  },
};

export default { colors, radius };
