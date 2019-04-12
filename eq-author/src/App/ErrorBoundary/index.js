import React from "react";
import PropTypes from "prop-types";
import NotFound from "App/NotFoundPage";
import { ERR_PAGE_NOT_FOUND } from "constants/error-codes";

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  state = { error: false };

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error.message === ERR_PAGE_NOT_FOUND) {
      // You can render any custom fallback UI
      return <NotFound />;
    }

    return this.props.children;
  }
}
