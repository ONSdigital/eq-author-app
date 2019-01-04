import PropTypes from "prop-types";
export const propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "tertiary",
    "tertiary-light"
  ]),
  small: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default propTypes;
