import React, { createContext } from "react";

const ValidationsContext = createContext({
  validations: null,
});

export const withValidations = Component => {
  const WrappedComponent = props => (
    <ValidationsContext.Consumer>
      {({ validations }) => <Component {...props} validations={validations} />}
    </ValidationsContext.Consumer>
  );
  WrappedComponent.fragments = Component.fragments;
  return WrappedComponent;
};

export default ValidationsContext;
