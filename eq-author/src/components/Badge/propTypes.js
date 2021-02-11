import PropTypes from "prop-types";
export const propTypes = {
  variant: PropTypes.oneOf([
    "logic",
    "nav",
    "nav-small",
    "main-nav-small",
    "tabs-small",
  ]),
};

export default propTypes;
