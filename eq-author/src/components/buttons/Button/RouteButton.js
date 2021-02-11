import React from "react";
import PropTypes from "prop-types";
import { propTypes } from "./propTypes";
import { Link } from "react-router-dom";
import { pick } from "lodash/fp";
import Button from "./";

const DisabledLink = Button.withComponent("div");

const propWhitelist = [
  "to",
  "title",
  "id",
  "className",
  "children",
  "disabled",
  "data-test",
];
const RouteLink = (props) => <Link {...pick(propWhitelist, props)} />;

const StyledRouteLink = Button.withComponent(RouteLink);

class RouteButton extends React.Component {
  static propTypes = {
    ...propTypes,
    to: PropTypes.string.isRequired,
  };
  render() {
    const { children, to, disabled, ...otherProps } = this.props;

    if (disabled) {
      return (
        <DisabledLink disabled {...otherProps}>
          {children}
        </DisabledLink>
      );
    }
    return (
      <StyledRouteLink {...otherProps} to={to}>
        {children}
      </StyledRouteLink>
    );
  }
}

export default RouteButton;
