import React from "react";
import PropTypes from "prop-types";
import Button from "./";
import { propTypes } from "./propTypes";

const StyledLink = Button.withComponent("a");
const DisabledLink = Button.withComponent("div");

class LinkButton extends React.Component {
  static propTypes = {
    ...propTypes,
    href: PropTypes.string.isRequired,
  };

  render() {
    const { children, href, disabled, ...otherProps } = this.props;
    return disabled ? (
      <DisabledLink aria-disabled="true" disabled {...otherProps}>
        {children}
      </DisabledLink>
    ) : (
      <StyledLink
        {...otherProps}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </StyledLink>
    );
  }
}

export default LinkButton;
