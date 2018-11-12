import React from "react";
import PropTypes from "prop-types";
import Button from "components/Button";
import { propTypes } from "components/Button/propTypes";

const StyledLink = Button.withComponent("a");

class LinkButton extends React.Component {
  static propTypes = {
    ...propTypes,
    href: PropTypes.string.isRequired
  };

  render() {
    const { children, href, ...otherProps } = this.props;
    return (
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
