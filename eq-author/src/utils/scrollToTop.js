import React, { useEffect, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

function ScrollToTop({ history, children }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, []);

  return <Fragment>{children}</Fragment>;
}

ScrollToTop.propTypes = {
  history: PropTypes.object, // eslint-disable-line
  children: PropTypes.any, // eslint-disable-line
};

export default withRouter(ScrollToTop);
