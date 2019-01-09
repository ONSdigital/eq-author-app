import React from "react";

export default (oldName, newName) => Component => props => {
  const newProps = {
    [newName]: props[oldName],
    ...props
  };
  return <Component {...newProps} />;
};
