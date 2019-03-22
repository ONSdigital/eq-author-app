import React from "react";

export default (oldName, newName) => WrappedComponent =>
  class RemappedComponent extends React.Component {
    static fragments = WrappedComponent.fragments;
    static displayName = `withPropRenamed(${WrappedComponent.displayName})`;
    render() {
      const newProps = { ...this.props, [newName]: this.props[oldName] };
      return <WrappedComponent {...newProps} />;
    }
  };
