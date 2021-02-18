import PropTypes from "prop-types";
import React from "react";
import { inRange, isNaN } from "lodash";

const withCustomNumberValueChange = (WrappedComponent) => {
  return class extends React.Component {
    static defaultProps = {
      limit: 999999999,
    };

    static propTypes = {
      limit: PropTypes.number.isRequired,
      onChange: PropTypes.func.isRequired,
    };

    handleCustomValueChange = ({ value }) => {
      // clamp value of input to +/- limit
      if (
        value !== null &&
        !inRange(
          parseInt(value, 10),
          0 - this.props.limit,
          this.props.limit + 1
        )
      ) {
        return false;
      }

      const intValue = parseInt(value, 10);
      this.props.onChange({
        name: "custom",
        value: isNaN(intValue) ? null : intValue,
      });
    };

    render() {
      return (
        <WrappedComponent
          onCustomNumberValueChange={this.handleCustomValueChange}
          {...this.props}
        />
      );
    }
  };
};

export default withCustomNumberValueChange;
