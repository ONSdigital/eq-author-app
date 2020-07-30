//Credit https://medium.com/@hello_21915/testing-the-scrolltotop-component-in-react-with-enzyme-and-jest-5342fab570b4

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTop.propTypes = {
  location: PropTypes.object, // eslint-disable-line
  children: PropTypes.node, // eslint-disable-line
};

export default withRouter(ScrollToTop);
