import PropTypes from "prop-types";
export const propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "tertiary",
    "tertiary-light",
    "positive",
    "negative",
    "greyed",
    "navigation",
    "navigation-modal",
    "navigation-on",
    "signout",
  ]),
  small: PropTypes.bool,
  medium: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default propTypes;
