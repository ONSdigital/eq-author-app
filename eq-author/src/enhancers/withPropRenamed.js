import React from "react";

export default (oldName, newName) => (WrappedComponent) => {
  const Component = (props) => {
    const newProps = {
      [newName]: props[oldName],
      ...props,
    };
    return <WrappedComponent {...newProps} />;
  };
  Component.fragments = WrappedComponent.fragments;
  Component.displayName = `withPropRenamed(${WrappedComponent.displayName})`;
  return Component;
};
