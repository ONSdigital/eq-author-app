import PropTypes from "prop-types";
import React from "react";

import VALIDATION_MESSAGES from "constants/validationMessages";

const withValidationError = entityPropName => WrappedComponent => {
  return class extends React.Component {
    static propTypes = {
      enableValidationMessage: PropTypes.bool,
      [entityPropName]: PropTypes.object.isRequired, // eslint-disable-line
    };

    static defaultProps = {
      enableValidationMessage: true,
    };

    getValidationError = ({ field, label }) => {
      const {
        [entityPropName]: { validationErrorInfo, isNew },
      } = this.props;

      const messages = validationErrorInfo && validationErrorInfo.errors;

      if (!messages || isNew) {
        return null;
      }

      const fieldMessage = messages.find(m => m.field === field);

      const errorMessageTemplate = VALIDATION_MESSAGES[fieldMessage.errorCode];

      if (errorMessageTemplate) {
        return errorMessageTemplate({ label });
      } else {
        return fieldMessage.errorCode;
      }
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
