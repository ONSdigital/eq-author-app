import React from "react";
import PropTypes from "prop-types";

const withChangeHandler = (WrappedComponent) => {
  return class extends React.Component {
    static propTypes = {
      onChange: PropTypes.func,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      id: PropTypes.string,
      name: PropTypes.string,
      className: PropTypes.string,
    };

    static displayName = `withChangeHandler(${WrappedComponent.displayName})`;

    handleChange = (e) => {
      const name = this.props.name || this.props.id;
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      this.props.onChange({ name, value });
    };

    render() {
      const { value, className, ...otherProps } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          value={value === null ? "" : value}
          onChange={this.handleChange}
          className={className}
        />
      );
    }
  };
};

export default withChangeHandler;
