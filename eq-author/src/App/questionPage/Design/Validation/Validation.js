import React from "react";
import PropTypes from "prop-types";

import DisabledMessage from "./DisabledMessage";
import ValidationView from "./ValidationView";

class Validation extends React.Component {
  handleToggleChange = ({ value: enabled }) => {
    const {
      onToggleValidationRule,
      validation: { id },
    } = this.props;

    onToggleValidationRule({
      id,
      enabled,
    });
  };

  renderDisabled = () => <DisabledMessage name={this.props.displayName} />;

  render() {
    const {
      testId,
      validation: { enabled },
      children,
    } = this.props;

    return (
      <ValidationView
        data-test={testId}
        enabled={enabled}
        onToggleChange={this.handleToggleChange}
      >
        {enabled ? children(this.props) : this.renderDisabled()}
      </ValidationView>
    );
  }
}

Validation.propTypes = {
  testId: PropTypes.string,
  displayName: PropTypes.string,
  validation: PropTypes.shape({
    id: PropTypes.string,
    enabled: PropTypes.bool,
  }),
  onToggleValidationRule: PropTypes.func,
  children: PropTypes.func,
};

export default Validation;
