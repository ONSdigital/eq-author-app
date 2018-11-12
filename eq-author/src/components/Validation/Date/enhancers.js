import React from "react";

export const withPropRemapped = (
  oldName,
  newName,
  mapper
) => Component => props => {
  const newProps = {
    [newName]: (...args) => props[oldName](mapper(...args)),
    ...props
  };
  return <Component {...newProps} />;
};

export const withProps = partialProps => Component => props => (
  <Component {...partialProps} {...props} />
);

export const withPropRenamed = (oldName, newName) => Component => props => {
  const newProps = {
    [newName]: props[oldName],
    ...props
  };
  return <Component {...newProps} />;
};
