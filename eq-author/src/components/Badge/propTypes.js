import PropTypes from "prop-types";

export const propTypes = {
  variant: PropTypes.oneOf(["logic", "nav", "main-nav", "tabs"]),
  small: PropTypes.bool,
  medium: PropTypes.bool,
};

export default propTypes;
