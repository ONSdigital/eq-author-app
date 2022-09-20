import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { radius, colors, focusStyle } from "constants/theme";

import { ReactComponent as Icon } from "App/QuestionnaireDesignPage/MainNavigation/icons/view-survey-icon.svg";

const Button = styled.button`
  display: inline-flex;
  flex: 0 0 auto;
  color: ${colors.primary};
  background-color: transparent;
  padding: 0.75em 1em;
  border-radius: ${radius};
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.1;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  text-decoration: none;
  transition: all 100ms ease-out;
  letter-spacing: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid ${colors.primary};
  margin-top: 8px;

  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }

  &:hover {
    color: ${colors.white};
    background-color: ${colors.primary};
  }

  &:focus-within {
    ${focusStyle}
  }
`;

const ExternalIcon = styled(Icon)`
  margin-left: 12px;
  path {
    fill: currentColor;
  }
`;

const EnabledLinkButton = Button.withComponent("a");
const DisabledLinkButton = Button.withComponent("div");

const LinkButtonWithIcon = ({ text, url, dataTest, disabled }) => {
  return disabled ? (
    <DisabledLinkButton aria-disabled="true" disabled data-test={dataTest}>
      <span>{text}</span>
      <ExternalIcon />
    </DisabledLinkButton>
  ) : (
    <EnabledLinkButton
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-test={dataTest}
    >
      <span>{text}</span>
      <ExternalIcon />
    </EnabledLinkButton>
  );
};

LinkButtonWithIcon.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  dataTest: PropTypes.string,
  disabled: PropTypes.bool,
};

export default LinkButtonWithIcon;
