import React from "react";
import PropTypes from "prop-types";
import NotFound from "App/NotFoundPage";
import AccessDenied from "App/AccessDeniedPage";
import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = { error: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error.message === ERR_PAGE_NOT_FOUND) {
      return <NotFound />;
    }
    if (this.state.error.message === ERR_UNAUTHORIZED_QUESTIONNAIRE) {
      return <AccessDenied />;
    }

    return this.props.children;
  }
}
