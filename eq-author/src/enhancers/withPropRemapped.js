import React from "react";

export default (oldName, newName, mapper) => (Component) => (props) => {
  const newProps = {
    [newName]: (...args) => props[oldName](mapper(...args)),
    ...props,
  };
  return <Component {...newProps} />;
};
