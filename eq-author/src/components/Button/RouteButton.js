import React from "react";
import PropTypes from "prop-types";
import { propTypes } from "components/Button/propTypes";
import { Link } from "react-router-dom";
import { pick } from "lodash/fp";
import Button from "components/Button";

const propWhitelist = ["to", "title", "id", "className", "children"];
const RouteLink = props => <Link {...pick(propWhitelist, props)} />;

const StyledRouteLink = Button.withComponent(RouteLink);

class RouteButton extends React.Component {
  static propTypes = {
    ...propTypes,
    to: PropTypes.string.isRequired
  };
  render() {
    const { children, to, ...otherProps } = this.props;
    return (
      <StyledRouteLink {...otherProps} to={to}>
        {children}
      </StyledRouteLink>
    );
  }
}

export default RouteButton;
