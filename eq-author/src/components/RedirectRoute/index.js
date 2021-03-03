import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { generatePath } from "utils/UrlUtils";

// react-router will eventually support something akin to this.
// at that point we can drop this component
const RedirectRoute = ({ to, from }) => {
  const render = (props) => (
    <Redirect to={generatePath(to)(props.match.params)} />
  );

  return <Route exact path={from} render={render} />;
};

RedirectRoute.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object, // eslint-disable-line
  }),
};

export default RedirectRoute;
