import PropTypes from "prop-types";
import React from "react";
import { propType } from "graphql-anywhere";
import pageFragment from "graphql/fragments/page.graphql";

const withValidationError = WrappedComponent => {
  return class extends React.Component {
    static propTypes = {
      enableValidationMessage: PropTypes.bool,
      page: propType(pageFragment).isRequired,
    };

    static defaultProps = {
      enableValidationMessage: true,
    };

    getValidationError = field => {
      const {
        page: { validationErrorInfo },
        enableValidationMessage,
      } = this.props;

      const messages = validationErrorInfo && validationErrorInfo.errors;

      if (!messages || !enableValidationMessage) {
        return {};
      }

      return messages.find(m => m.field === field);
    };

    render() {
      return (
        <WrappedComponent
          getValidationError={this.getValidationError}
          {...this.props}
        />
      );
    }
  };
};

export default withValidationError;
