import PropTypes from "prop-types";
import React from "react";

const withChangeUpdate = (WrappedComponent) => {
  return class extends React.Component {
    static propTypes = {
      onChange: PropTypes.func.isRequired,
      onUpdate: PropTypes.func.isRequired,
    };
    static fragments = WrappedComponent.fragments;

    static fragments = WrappedComponent.fragments;
    static displayName = `withChangeUpdate(${WrappedComponent.displayName})`;

    handleUpdate = (update) => this.props.onChange(update, this.props.onUpdate);

    render() {
      return (
        <WrappedComponent onChangeUpdate={this.handleUpdate} {...this.props} />
      );
    }
  };
};

export default withChangeUpdate;
